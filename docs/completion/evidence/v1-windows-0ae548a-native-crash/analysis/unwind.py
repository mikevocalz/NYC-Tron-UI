import sys,struct,json,bisect,pathlib
sys.path.insert(0,'/workspace/scratch/4137c61be495/windows-crash-analysis-tools')
import pefile
from minidump.minidumpfile import MinidumpFile
root=pathlib.Path(__file__).parent
m=MinidumpFile.parse(str(root.parent/'windows-pr60-0ae548-uia/crash-dumps/NYCTronWindowsExample.exe.8280.dmp'))
reader=m.get_reader()
regs={k:int(v,16) for k,v in json.loads((root/'exception-context.json').read_text())['context'].items()}
regnames=['Rax','Rcx','Rdx','Rbx','Rsp','Rbp','Rsi','Rdi']+[f'R{i}' for i in range(8,16)]
mods={x.name.split('\\')[-1].lower():x for x in m.modules.modules}
class PEData:
 def __init__(self,name):
  self.name=name; self.mod=mods[name.lower()]; self.base=self.mod.baseaddress; self.pe=pefile.PE(str(root/'binaries'/name));
  assert self.pe.FILE_HEADER.TimeDateStamp==self.mod.timestamp and self.pe.OPTIONAL_HEADER.SizeOfImage==self.mod.size
  self.entries=[(e.struct.BeginAddress,e.struct.EndAddress,e.struct.UnwindData) for e in self.pe.DIRECTORY_ENTRY_EXCEPTION]
  self.starts=[x[0] for x in self.entries]
 def read(self,rva,n):
  b=self.pe.get_data(rva,n); assert len(b)==n;return b
class PDBData:
 def __init__(self):
  self.name='Microsoft.UI.Xaml.dll'; self.mod=mods[self.name.lower()]; self.base=self.mod.baseaddress
  s=root.parent/'windows-pr60-0ae548-symbols'
  self.pdata=(s/'Microsoft.ui.xaml.pdata.bin').read_bytes(); self.xdata=(s/'Microsoft.ui.xaml.xdata.bin').read_bytes()
  _,ph,pl,self.pbase=struct.unpack_from('<IIII',self.pdata); _,xh,xl,self.xbase=struct.unpack_from('<IIII',self.xdata)
  assert ph==32 and xh==32 and pl==len(self.pdata)-ph and xl==len(self.xdata)-xh and pl%12==0
  self.pdata=self.pdata[ph:];self.xdata=self.xdata[xh:]
  self.entries=list(struct.iter_unpack('<III',self.pdata));self.starts=[x[0] for x in self.entries]
  assert self.starts==sorted(self.starts)
 def read(self,rva,n):
  if self.xbase<=rva and rva+n<=self.xbase+len(self.xdata): return self.xdata[rva-self.xbase:rva-self.xbase+n]
  if self.pbase<=rva and rva+n<=self.pbase+len(self.pdata): return self.pdata[rva-self.pbase:rva-self.pbase+n]
  raise ValueError(f'PDB read outside extracted tables {rva:x}/{n}')
data={x.name.lower():x for x in [PEData('KERNELBASE.dll'),PEData('ntdll.dll'),PDBData()]}
def memory(addr,n): return reader.read(addr,n)
def u64(addr): return struct.unpack('<Q',memory(addr,8))[0]
def location(addr):
 for mod in m.modules.modules:
  if mod.baseaddress<=addr<mod.endaddress:
   return mod,addr-mod.baseaddress
 return None,None
frames=[]
for f in range(30):
 mod,rva=location(regs['Rip']); frame={'frame':f,'rip':hex(regs['Rip']),'rsp':hex(regs['Rsp']),'registers':{k:hex(v) for k,v in regs.items()},'module':mod.name if mod else None,'rva':hex(rva) if mod else None}
 frames.append(frame)
 if mod is None: frame['stop']='RIP not in a dump module'; break
 d=data.get(mod.name.split('\\')[-1].lower())
 if not d: frame['stop']='No matched unwind metadata; do not continue as leaf';break
 i=bisect.bisect_right(d.starts,rva)-1
 if i<0 or rva>=d.entries[i][1]:
  frame['leaf']=True;regs['Rip']=u64(regs['Rsp']);regs['Rsp']+=8;continue
 entry=d.entries[i]; frame['runtimeFunction']=[hex(v) for v in entry]
 logs=[];frame['unwind']=logs
 for chain in range(10):
  begin,end,urva=entry
  h=d.read(urva,4);version=h[0]&7;flags=h[0]>>3;prolog=h[1];count=h[2];fp=h[3]&15;fpo=h[3]>>4
  assert version == 1, version
  codes=d.read(urva+4,2*count)
  base=regs[regnames[fp]]-16*fpo if fp else regs['Rsp']
  log={'unwindRva':hex(urva),'version':version,'flags':flags,'prolog':prolog,'count':count,'frameRegister':regnames[fp] if fp else None,'frameOffset':16*fpo,'codesHex':codes.hex(),'operations':[]}
  logs.append(log);j=0
  while j<count:
   off,opinfo=codes[j*2:j*2+2];op=opinfo&15;info=opinfo>>4;used=1;detail={'offset':off,'op':op,'info':info}
   run=chain>0 or rva-begin>=off
   if op==0:
    if run: regs[regnames[info]]=u64(regs['Rsp']);regs['Rsp']+=8
   elif op==1:
    used=2 if info==0 else 3; size=struct.unpack_from('<H' if info==0 else '<I',codes,(j+1)*2)[0]*(8 if info==0 else 1);detail['bytes']=size
    if run:regs['Rsp']+=size
   elif op==2:
    if run:regs['Rsp']+=info*8+8
   elif op==3:
    if run:regs['Rsp']=regs[regnames[fp]]-16*fpo
   elif op in (4,5):
    used=2 if op==4 else 3;offset=struct.unpack_from('<H' if op==4 else '<I',codes,(j+1)*2)[0]*(8 if op==4 else 1);detail['stackOffset']=offset
    if run:regs[regnames[info]]=u64(base+offset)
   elif op in (8,9):
    used=2 if op==8 else 3; detail['ignoredXMM']=True
   else: raise ValueError(f'Unsupported opcode {op} at {hex(urva)}')
   detail['applied']=run; log['operations'].append(detail);j+=used
  if flags&4:
   entry=struct.unpack('<III',d.read(urva+4+((count+1)&~1)*2,12));log['chain']=[hex(v) for v in entry]
  else:break
 else:raise ValueError('Too much chain')
 frame['returnAddressSlot']=hex(regs['Rsp']);regs['Rip']=u64(regs['Rsp']);regs['Rsp']+=8
 frame['callerRip']=hex(regs['Rip'])
 if regs['Rip']==0:break
(root/'unwound-frames-initial.json').write_text(json.dumps(frames,indent=2)+'\n')
for f in frames:
 print(f['frame'],(f['module'] or '').split('\\')[-1],f['rva'],f['rsp'],f.get('runtimeFunction'),f.get('stop',''))
