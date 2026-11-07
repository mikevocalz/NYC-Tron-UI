const {withGradleProperties}=require('expo/config-plugins');
/** Skia 3's Dawn/Vulkan runtime requires Android API 26. Preserve every other property. */
function ensureGraphiteMinSdk(entries){
 const key='android.minSdkVersion',values=entries.filter(entry=>entry.type==='property'&&entry.key===key);
 let minimum=26;
 for(const entry of values){const value=Number(entry.value);if(!Number.isInteger(value)||value<1)throw new RangeError('android.minSdkVersion must be a positive integer');minimum=Math.max(minimum,value);}
 const result=entries.filter(entry=>entry.type!=='property'||entry.key!==key);
 return [...result,{type:'property',key,value:String(minimum)}];
}
function withGraphiteAndroid(config){return withGradleProperties(config,mod=>{mod.modResults=ensureGraphiteMinSdk(mod.modResults);return mod;});}
module.exports=withGraphiteAndroid;
module.exports.ensureGraphiteMinSdk=ensureGraphiteMinSdk;
