import ts from 'typescript';

// Parse declarations so ordinary UI copy containing "import" or "export"
// cannot be mistaken for a package dependency.
export function importSpecifiers(text){
 const source=ts.createSourceFile('module.js',text,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);
 return source.statements.flatMap(node=>(ts.isImportDeclaration(node)||ts.isExportDeclaration(node))&&node.moduleSpecifier&&ts.isStringLiteral(node.moduleSpecifier)?[node.moduleSpecifier.text]:[]);
}
