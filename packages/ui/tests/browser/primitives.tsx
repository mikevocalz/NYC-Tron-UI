import {AppRegistry,ScrollView,Text,View} from "react-native";
import {create} from "zustand";
import {Banner} from "../../src/components/feedback/Banner.tsx";
import {Badge} from "../../src/components/feedback/Badge.tsx";
import {EmptyState} from "../../src/components/feedback/EmptyState.tsx";
import {ErrorMessage} from "../../src/components/feedback/ErrorMessage.tsx";
import {KeyValueList} from "../../src/components/content/KeyValueList.tsx";
import {NightScope} from "../../src/components/theme/NightScope.tsx";
import {DropZone} from "../../src/components/files/DropZone.web.tsx";
import {FilePicker} from "../../src/components/files/FilePicker.web.tsx";
import {Button} from "../../src/components/Button.tsx";
import {Page,Main,Header,Footer,Section,Nav,Heading,Paragraph,Link,Text as SemanticText,Input} from "../../src/components/html/semantic.web.tsx";

type Demo={dropped:string[];picked:string[];dismissed:number;notice:boolean;retries:number;exits:number;entered:number};
const useDemo=create<Demo>(()=>({dropped:[],picked:[],dismissed:0,notice:true,retries:0,exits:0,entered:0}));
const params=new URLSearchParams(location.search);
const theme=params.get("theme")??"light";
const dir=params.get("dir")==="rtl"?"rtl":"ltr";

const RECORD=[
  {key:"kind",label:"Document",value:"Quill essay"},
  {key:"size",label:"Size",value:"18,204 bytes"},
  {key:"saved",label:"Last saved",value:"2 minutes ago"},
  {key:"owner",label:"Owner",value:null},
  {key:"engine",label:"Engine",value:"Rust 0.8.2",action:<Badge label="Local" tone="success" size="xs"/>},
];

function Fixture(){
  const s=useDemo();
  return <ScrollView contentContainerStyle={{padding:16,gap:24,maxWidth:760,width:"100%",alignSelf:"center"}}>
    <Main dataSet={{theme}} dir={dir} className="gap-6">
      <Nav className="flex-row items-center justify-between gap-3" aria-label="App navigation">
        <Link className="text-base font-semibold text-text" href="#/">
          <SemanticText className="text-text-muted" aria-hidden>N </SemanticText>NitroForge
        </Link>
        <Badge label="Open in this session" size="xs"/>
      </Nav>
      <Section className="gap-3" aria-labelledby="notices-heading">
        <Header className="gap-1">
          <Heading level={1} id="notices-heading" className="text-2xl font-semibold text-text">Notices</Heading>
          <Paragraph className="text-sm text-text-muted">Every tone, with and without actions.</Paragraph>
        </Header>
        <Banner tone="info" title="Saved 18,204 bytes from the Rust engine"
          description="Your document is stored in this browser session only."/>
        {s.notice
          ? <Banner tone="success" title="Word document exported" onDismiss={()=>useDemo.setState(d=>({notice:false,dismissed:d.dismissed+1}))}/>
          : null}
        <Banner tone="danger" live="alert" title="Couldn't open essay.docx"
          description="The file is not a Word document. Choose a DOCX or NFD document."
          action={<Button title="Try again" variant="secondary" size="sm" onPress={()=>useDemo.setState(d=>({retries:d.retries+1}))}/>}/>
        <Banner tone="neutral" title="Read-only preview" description="Editing needs the desktop app."/>
        <ErrorMessage message="Apply your text changes before opening another document."/>
        <ErrorMessage/>
      </Section>
      <Section className="gap-3" aria-labelledby="badges-heading">
        <Heading level={2} id="badges-heading" className="text-lg font-semibold text-text">Badges</Heading>
        <View style={{flexDirection:"row",flexWrap:"wrap",gap:8}}>
          <Badge label="3"/><Badge label="Draft" size="xs"/><Badge label="Synced" tone="success"/>
          <Badge label="Beta" tone="info"/><Badge label="Conflict" tone="danger"/><Badge label="Live" tone="accent"/>
        </View>
      </Section>
      <Section className="gap-3" aria-labelledby="record-heading">
        <Heading level={2} id="record-heading" className="text-lg font-semibold text-text">Record</Heading>
        <View testID="kv" {...{className:"rounded-card border border-border bg-surface-raised"}} style={{padding:16}}>
          <KeyValueList items={RECORD}/>
        </View>
      </Section>
      <Section className="gap-3" aria-labelledby="files-heading">
        <Heading level={2} id="files-heading" className="text-lg font-semibold text-text">Files</Heading>
        <DropZone testID="drop-default" accept=".docx,.nfd" disableObjectUrl
          description="Word documents and NFD files."
          onEnter={()=>useDemo.setState(d=>({entered:d.entered+1}))}
          onDrop={({assets})=>useDemo.setState({dropped:assets.map(a=>a.fileName??a.type)})}/>
        {/* Forge's studio-preview shape: an unstyled zone wrapping its own Open control. */}
        <DropZone testID="drop-forge" unstyled accept=".nfd" disableObjectUrl
          onDrop={({assets})=>useDemo.setState({dropped:assets.map(a=>a.fileName??a.type)})}>
          <FilePicker label="Open" accept=".nfd" testID="open" onFiles={files=>useDemo.setState({picked:files.map(f=>f.name)})}/>
        </DropZone>
        <Input aria-label="Document title" placeholder="Untitled document"
          {...{className:"rounded-control border border-border bg-surface-sunken px-3 text-base text-text"}}/>
      </Section>
      <Section className="gap-3" aria-labelledby="empty-heading">
        <Heading level={2} id="empty-heading" className="text-lg font-semibold text-text">Empty</Heading>
        <View {...{className:"rounded-card border border-border bg-surface-raised"}}>
          <EmptyState title="No layers" tone="carolina"
            description="Add a shape or raster layer to begin. Imports from other apps open in Prism on desktop."
            exitAction={{title:"Add rectangle",onPress:()=>useDemo.setState(d=>({exits:d.exits+1}))}}/>
        </View>
      </Section>
      <Section className="gap-3" aria-labelledby="night-heading">
        <Heading level={2} id="night-heading" className="text-lg font-semibold text-text">Night scope</Heading>
        <NightScope>
          <View testID="night" {...{className:"rounded-card border border-border bg-surface-sunken"}} style={{padding:16,gap:12}}>
            <Text testID="night-text" {...{className:"text-text"}}>Editor surface, dark on every page.</Text>
            <KeyValueList columns={1} surface="night" items={RECORD.slice(0,3)}/>
            <Banner tone="info" title="Layer preview is rendering"/>
          </View>
        </NightScope>
      </Section>
      <Page className="workspace-container" data-host-width="phone" hidden testID="hidden-page">
        <Text>Hidden workspace</Text>
      </Page>
      <Footer className="gap-1">
        <SemanticText className="text-sm text-text-muted">Your apps, separate workspaces.</SemanticText>
        <Link className="text-sm text-primary underline" href="https://example.com/help" target="_blank">Help</Link>
      </Footer>
      <View style={{gap:4}}>
        <Text testID="dropped" {...{className:"text-text-muted"}}>{"dropped "+s.dropped.join(",")}</Text>
        <Text testID="picked" {...{className:"text-text-muted"}}>{"picked "+s.picked.join(",")}</Text>
        <Text testID="counts" {...{className:"text-text-muted"}}>{`dismissed ${s.dismissed} retries ${s.retries} exits ${s.exits} entered ${s.entered}`}</Text>
      </View>
    </Main>
  </ScrollView>;
}
document.documentElement.dataset.theme=theme;
document.documentElement.dir=dir;
AppRegistry.registerComponent("Primitives",()=>Fixture);
AppRegistry.runApplication("Primitives",{rootTag:document.getElementById("root")});
