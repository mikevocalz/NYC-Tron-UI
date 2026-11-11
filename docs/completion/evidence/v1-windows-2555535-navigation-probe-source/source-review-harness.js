function reviewNativeNavigationFixture(input){
  const {navigationBefore,navigationAfter,header,prepareBefore,prepareAfter,manifest,hostTemplate,propertyBag,libraryPch,appPch,prepareConsumer,packageJson}=input;
  const groups=[];let assertions=0;
  function assert(ok,label){assertions++;if(!ok)throw new Error(label);}
  function one(text,part,label){assert(text.split(part).length===2,label+" unique");}
  function group(name,fn){fn();groups.push({name,status:"passed"});}
  function section(text,start,end){one(text,start,"section start");const i=text.indexOf(start),j=text.indexOf(end,i+start.length);assert(j>i,"section end");return text.slice(i,j);}
  function inverse(current,edits){for(const e of [...edits].reverse()){one(current,e.after,e.label+" inverse");current=current.replace(e.after,()=>e.before);}return current;}
  function forward(current,edits){for(const e of edits){one(current,e.before,e.label+" forward");current=current.replace(e.before,()=>e.after);}return current;}
  group("Exact native/preparer edits and addition identity",()=>{
    const [component,addition,preparer]=manifest.files;
    assert(forward(navigationBefore,component.edits)===navigationAfter,"component forward");
    assert(inverse(navigationAfter,component.edits)===navigationBefore,"component inverse");
    assert(forward(prepareBefore,preparer.edits)===prepareAfter,"preparer forward");
    assert(inverse(prepareAfter,preparer.edits)===prepareBefore,"preparer inverse");
    assert(addition.before===null&&addition.content===header,"new header content");
    assert(component.edits.length===6&&preparer.edits.length===1,"bounded edit count");
  });
  group("Exact private COM ABI and cross-module ownership contract",()=>{
    const definition=manifest.abi.definition;
    one(header,definition,"header ABI");one(navigationAfter,definition,"component ABI");
    assert(definition.includes('uuid("91bd88af-7765-4adb-8891-f5436ca14c2f")')&&definition.includes(": ::IUnknown"),"fixed IID and base");
    assert((definition.match(/HRESULT STDMETHODCALLTYPE/g)||[]).length===2&&(definition.match(/noexcept = 0/g)||[]).length===2,"HRESULT/noexcept agreement");
    assert(definition.includes("::IInspectable* navigation, ::IInspectable* island,")&&definition.includes("::IInspectable* view, ::IInspectable** ticket)"),"borrowed pointers and output pointer");
    assert(header.includes("Object object{nullptr};\n  winrt::copy_from_abi(object, raw);\n  return object.as<T>();"),"borrow AddRef to base before QI");
    assert(header.includes("ticket.as<::IInspectable>().copy_to(ticketOut);")&&navigationAfter.includes("winrt::com_ptr<::IInspectable> ticket;"),"returned AddRef owner");
    assert(header.includes("uint32_t generation{};")&&header.includes("GenerationLimit = 128;")&&header.includes("unbox_value<uint32_t>"),"ticket width and bound");
    assert(!header.includes("ReactNonAbiValue")&&!navigationAfter.includes("ReactNonAbiValue"),"no non-ABI wrapper crossing");
    assert(propertyBag.includes("same DLL or EXE module. Using it from a different module may cause a security bug or a crash."),"pinned warning");
    for(const pch of [libraryPch,appPch])assert(pch.indexOf("#include <unknwn.h>")>=0&&pch.indexOf("#include <unknwn.h>")<pch.indexOf("#include <winrt/"),"pinned unknwn include order");
    assert(header.indexOf("#include <unknwn.h>")<header.indexOf("#include <winrt/"),"private header include order");
    assert(header.includes('#pragma comment(lib, "Comctl32.lib")'),"subclass imports link explicit");
  });
  group("Weak registry and exact mount/thread ownership source guards",()=>{
    const entry=section(header,"  struct Entry {","  struct Binding {");
    assert((entry.match(/winrt::weak_ref</g)||[]).length===4,"four weak visual references");
    assert(entry.includes("Ticket ticket{nullptr};")&&!entry.includes("shared_ptr"),"opaque ticket only");
    const registration=section(header,"  void Register(Object const&","  void RegistrationFailed(");
    assert(registration.indexOf("HasThreadAccess()")<registration.indexOf("compare_exchange_strong"),"UI access before atomic owner bind");
    assert(registration.indexOf("compare_exchange_strong")<registration.indexOf("m_hwnd = hwnd;"),"CAS before mutable registry owner");
    assert(header.includes("m_registrationInvalid.store(true, std::memory_order_release);"),"failure invalidates fixture");
    const check=section(header,"  void Check(Entry const&","  void Ancestry(");
    for(const part of ["m_entries.front().generation != entry.generation","Identity(m_entries.front().ticket) != Identity(entry.ticket)","const auto currentSite = values.view.ChildSiteLink();","currentSite.IsClosed()","values.site.IsClosed()","Identity(currentSite) != Identity(values.site)","values.island.IsClosed()","!values.island.IsConnected()","root.ContentIsland()","ContentIslandEnvironment().AppWindowId()"])
      assert(check.includes(part),"owner check "+part);
    const snapshot=section(header,"  Json::JsonObject Snapshot(","  void Request(");
    assert(snapshot.includes("const auto entry = m_entries.front();")&&!snapshot.includes("const auto& entry"),"copy weak entry across provider getters");
    assert((snapshot.match(/Check\(entry, values\);/g)||[]).length===2,"both measured snapshot checkpoints");
    assert(navigationAfter.includes("void Unmounted() noexcept { DetachFixture(); }"),"unmount detach");
    const destroy=section(navigationAfter,"  void Destroy() noexcept {","  void Mounted(");
    assert(destroy.indexOf("DetachFixture();")<destroy.indexOf("m_xamlIsland.Close()"),"detach before close");
    const detach=section(navigationAfter,"  void DetachFixture() noexcept {","  static void FocusItem(");
    assert(detach.indexOf("std::move(m_fixtureTicket)")<detach.indexOf("hook->Unregister"),"local ticket invalidated before callback");
    assert(detach.indexOf("std::move(m_fixtureHook)")<detach.indexOf("hook->Unregister"),"local hook invalidated before callback");
    assert(navigationAfter.includes("islandView.Unmounted([weak = data->get_weak()]"),"weak unmount event");
  });
  let preparationCases=0;
  group("Actual preparer JavaScript with mocked file/URL boundary",()=>{
    const newEdit=manifest.files[2].edits[0],block=newEdit.after.slice(0,-newEdit.before.length);
    const start='edit("windows/NYCTronWindowsExample/NYCTronWindowsExample.cpp",source=>{';
    const provider=section(prepareBefore,start,"// The installed tarballs must resolve");
    const include='#include "../../native/NavigationProbe.h"',revision="a".repeat(40);
    const configure='nyctron::fixture::ConfigureNavigationProbe(settings, L"'+revision+'");';
    const providerMarker="settings.PackageProviders().Append(winrt::NYCTronFluentFabric::ReactPackageProvider());";
    function run(host,preparation,onlyProbe=false,missingHeader=false){
      let current=host;
      const readFileSync=url=>{
        if(url.path==="package-preparation.json")return JSON.stringify(preparation);
        if(url.path==="native/NavigationProbe.h"&&!missingHeader)return header;
        throw new Error("mock file absent");
      };
      const edit=(path,fn)=>{assert(path==="windows/NYCTronWindowsExample/NYCTronWindowsExample.cpp","only host edited");current=fn(current);};
      const URL=function(path){this.path=path;};
      Function("readFileSync","edit","URL","root",(onlyProbe?"":provider)+block)(readFileSync,edit,URL,{});
      preparationCases++;return current;
    }
    function reject(...args){let thrown=false;try{run(...args);}catch{thrown=true;}assert(thrown,"preparation rejection");preparationCases++;}
    const record={schemaVersion:1,installedFromArchives:true,sourceRevision:revision};
    const current=run(hostTemplate,record);
    one(current,include,"probe include");one(current,configure,"probe configuration");one(current,providerMarker,"original provider");
    assert(current.indexOf(configure)<current.indexOf("RegisterAutolinkedNativeModulePackages(settings.PackageProviders());"),"probe before app package mount");
    assert(run(current,record)===current,"repeat preparation byte-idempotent");
    const withoutProbe=current.replace(include+"\n","").replace(configure+"\n  ","");
    assert(run(withoutProbe,record)===current,"existing provider early return does not skip independent fixture");
    reject(current,{...record,sourceRevision:"b".repeat(40)});
    for(const value of ["A".repeat(40),"a".repeat(39),'"; unexpected(); //',null,42])reject(hostTemplate,{...record,sourceRevision:value});
    reject(hostTemplate,{...record,installedFromArchives:false});
    reject(hostTemplate.replace("RegisterAutolinkedNativeModulePackages(settings.PackageProviders());","missing"),record,true);
    reject(hostTemplate.replace("RegisterAutolinkedNativeModulePackages(settings.PackageProviders());","RegisterAutolinkedNativeModulePackages(settings.PackageProviders());\nRegisterAutolinkedNativeModulePackages(settings.PackageProviders());"),record,true);
    reject(hostTemplate,record,false,true);
    reject(current.replace(include,""),record);
  });
  let geometryCases=0;
  group("Finite rectangle and checked pixel extent models (not native execution)",()=>{
    const fmax=3.4028234663852886e38;
    function finiteRect(r){const right=r.x+r.width,bottom=r.y+r.height;return [r.x,r.y,r.width,r.height,right,bottom].every(Number.isFinite)&&r.width>0&&r.height>0&&Math.abs(right)<=fmax&&Math.abs(bottom)<=fmax;}
    function pixels(r){const right=r.x+r.width,bottom=r.y+r.height;return [r.x,r.y,r.width,r.height].every(Number.isInteger)&&r.x>=-2147483648&&r.x<=2147483647&&r.y>=-2147483648&&r.y<=2147483647&&r.width>0&&r.width<=2147483647&&r.height>0&&r.height<=2147483647&&right>=-2147483648&&right<=2147483647&&bottom>=-2147483648&&bottom<=2147483647;}
    const cases=[
      [finiteRect,{x:0,y:0,width:16,height:16},true],
      [finiteRect,{x:-100,y:-100,width:16,height:16},true],
      [finiteRect,{x:Infinity,y:Infinity,width:-Infinity,height:-Infinity},false],
      [finiteRect,{x:0,y:0,width:0,height:16},false],
      [finiteRect,{x:0,y:0,width:16,height:-1},false],
      [finiteRect,{x:NaN,y:0,width:16,height:16},false],
      [finiteRect,{x:0,y:0,width:Infinity,height:16},false],
      [finiteRect,{x:fmax,y:0,width:fmax,height:16},false],
      [finiteRect,{x:0,y:fmax,width:16,height:fmax},false],
      [finiteRect,{x:0,y:0,width:Math.fround(1e-50),height:16},false],
      [pixels,{x:10,y:20,width:16,height:16},true],
      [pixels,{x:-2147483648,y:-100,width:16,height:16},true],
      [pixels,{x:2147483640,y:0,width:16,height:16},false],
      [pixels,{x:0,y:2147483640,width:16,height:16},false],
      [pixels,{x:0,y:0,width:0,height:16},false],
      [pixels,{x:0,y:0,width:16,height:NaN},false],
      [pixels,{x:1.5,y:0,width:16,height:16},false]
    ];
    for(const [fn,rect,expected]of cases){assert(fn(rect)===expected,"geometry case "+geometryCases);geometryCases++;}
    assert(header.includes("std::abs(right) <= std::numeric_limits<float>::max()")&&header.includes("std::abs(bottom) <= std::numeric_limits<float>::max()"),"float extent source guard");
    assert(header.includes("element.TransformToVisual(nullptr).TransformBounds(local)"),"null root transform");
    assert(header.includes("values.root.CoordinateConverter()")&&header.includes("converter.ConvertLocalToScreen(transformed)"),"same-root converter");
    assert(!header.includes("RasterizationScale("),"no duplicate manual scale");
  });
  group("Bounded observation protocol source guards and privacy",()=>{
    const publish=section(header,"inline void Publish(","inline bool FiniteRect(");
    for(const part of ["CREATE_NEW","FlushFileBuffers","MoveFileExW(temporary.c_str(), path.c_str(), MOVEFILE_WRITE_THROUGH)","bytes.size() > ResponseBytes"])
      assert(publish.includes(part),"publication guard "+part);
    assert(!publish.includes("MOVEFILE_REPLACE_EXISTING"),"immutable destination");
    const read=section(header,"inline std::string ReadComplete(","inline void Publish(");
    for(const part of ["FILE_SHARE_READ","FILE_FLAG_OPEN_REPARSE_POINT","FILE_ATTRIBUTE_REPARSE_POINT","before.nFileSizeLow > limit","read != bytes.size()","after.nFileIndexHigh != before.nFileIndexHigh","CompareFileTime"])
      assert(read.includes(part),"complete read guard "+part);
    const request=section(header,"  void Request(","struct Hook final");
    for(const part of ["sequence != m_lastSequence + 1","L\"sourceRevision\"","L\"session\"","L\"creationFileTime\"","L\"windowHandle\"","L\"generation\"","++m_lastSequence","Snapshot(phase, generation)"])
      assert(request.includes(part),"request identity "+part);
    assert(!request.includes('GetNamedString(L"path")')&&!request.includes('GetNamedString(L"command")'),"no arbitrary path or action");
    const visual=section(header,"  Visuals Find(","  void Check(");
    assert(visual.includes("nodes.size() >= NodeLimit")&&visual.includes("node.depth >= DepthLimit")&&visual.includes("!seen.insert(Identity(value)).second"),"complete bounded traversal");
    assert(visual.includes('button.Name() == L"TogglePaneButton"')&&visual.includes('icon.Name() != L"Icon"')&&visual.includes("parent == toggle"),"exact typed template ancestry selection");
    assert(!header.includes("SetFocus(")&&!header.includes("SetForegroundWindow(")&&!header.includes("SendInput(")&&!header.includes("AutomationProperties::Set"),"observation-only API boundary");
    assert(!header.includes("reinterpret_cast<uintptr_t>(m_hwnd)"),"no raw visual pointer records");
  });
  group("Example-only distribution and unchanged provider registration",()=>{
    const pkg=JSON.parse(packageJson);
    assert(!pkg.files.some(x=>x==="example"||x.startsWith("example/")),"private header not in shipping file inventory");
    assert(prepareConsumer.includes('cpSync(join(root, "example"), output'),"example copied from checkout");
    const excluded=/(?:^|[/\\])(?:node_modules|windows|vendor)(?:[/\\]|$)/;
    assert(!excluded.test("native/NavigationProbe.h"),"native fixture header survives example-copy filter");
    assert(prepareConsumer.includes("sourceRevision: head.stdout.trim()")&&prepareConsumer.includes("installedFromArchives: true"),"preparation exact revision receipt");
    assert(hostTemplate.indexOf("winrt::init_apartment")<hostTemplate.indexOf("RegisterAutolinkedNativeModulePackages(settings.PackageProviders());"),"official apartment initialization precedes fixture placement");
    const originalProvider=section(prepareBefore,'edit("windows/NYCTronWindowsExample/NYCTronWindowsExample.cpp",source=>{',"// The installed tarballs must resolve");
    assert(prepareAfter.includes(originalProvider),"original provider edit exact");
  });
  return {schemaVersion:1,status:"passed",scope:"V8 actual JavaScript preparer transforms with mocked IO; exact source/inverse checks and geometry models only. No C++, WinRT, PowerShell, Windows file IO or native execution.",groups,assertions,preparationCases,geometryCases};
}
