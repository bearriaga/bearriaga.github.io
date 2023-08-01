"use strict";(self["webpackChunkbryan_arriaga_website"]=self["webpackChunkbryan_arriaga_website"]||[]).push([[749],{4749:function(e,t,i){i.r(t),i.d(t,{default:function(){return J}});var r=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("WikiComponent")},l=[],c=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("v-btn",{attrs:{color:"primary"},on:{click:e.saveArticles}},[e._v("Save to Database")]),i("ul",e._l(e.articleHolder.articles,(function(t,r){return i("li",{key:r+t.id},[i("WikiArticle",{attrs:{article:t,"article-items":e.articleItems,categories:e.categories,"clear-article":e.clearArticle,level:1},on:{deleteArticleEmit:function(t){return e.deleteArticle(t)}}})],1)})),0),i("br"),i("v-btn",{attrs:{color:"primary"},on:{click:e.addArticle}},[e._v("Add Article")]),i("v-snackbar",{scopedSlots:e._u([{key:"action",fn:function(t){var r=t.attrs;return[i("v-btn",e._b({attrs:{color:"pink",text:""},on:{click:function(t){e.snackbar.show=!1}}},"v-btn",r,!1),[e._v(" Close ")])]}}]),model:{value:e.snackbar.show,callback:function(t){e.$set(e.snackbar,"show",t)},expression:"snackbar.show"}},[e._v(" "+e._s(e.snackbar.text)+" ")])],1)},a=[],s=function(){var e=this,t=e.$createElement,i=e._self._c||t;return i("div",[i("v-text-field",{attrs:{label:"Title"},model:{value:e.inputArticle.title,callback:function(t){e.$set(e.inputArticle,"title",t)},expression:"inputArticle.title"}},[i("v-icon",{attrs:{slot:"append",color:"error"},on:{click:function(t){e.deleteDialog=!0}},slot:"append"},[e._v("mdi-delete")])],1),i("v-text-field",{attrs:{label:"Subtitle"},model:{value:e.inputArticle.subtitle,callback:function(t){e.$set(e.inputArticle,"subtitle",t)},expression:"inputArticle.subtitle"}}),i("v-textarea",{attrs:{label:"Body","auto-grow":"",outlined:"",rows:"1"},model:{value:e.inputArticle.body,callback:function(t){e.$set(e.inputArticle,"body",t)},expression:"inputArticle.body"}}),i("v-combobox",{attrs:{placeholder:"Select from existing categories or enter a new one",items:e.categories,label:"Categories",multiple:""},model:{value:e.inputArticle.categories,callback:function(t){e.$set(e.inputArticle,"categories",t)},expression:"inputArticle.categories"}}),i("v-autocomplete",{attrs:{label:"Article References",items:e.articleItemsMinusCurrent.map((function(e){return{value:{id:e.id,type:"article"},text:e.title}})),multiple:""},model:{value:e.inputArticle.references,callback:function(t){e.$set(e.inputArticle,"references",t)},expression:"inputArticle.references"}}),i("v-btn",{attrs:{color:"primary"},on:{click:e.addArticle}},[e._v("Add Subarticle")]),i("ul",e._l(e.inputArticle.articles,(function(t,r){return i("li",{key:r+t.id},[i("WikiArticle",{attrs:{article:t,"article-items":e.articleItems,categories:e.categories,"clear-article":e.clearArticle,level:+e.level+1},on:{deleteArticleEmit:function(t){return e.deleteArticle(t)}}})],1)})),0),i("v-dialog",{attrs:{width:"500"},model:{value:e.deleteDialog,callback:function(t){e.deleteDialog=t},expression:"deleteDialog"}},[i("v-card",[i("v-card-title",{staticClass:"text-h5 grey lighten-2"},[e._v(" Delete Article ")]),i("v-card-text",[e._v(" Are you sure you want to delete the "),i("b",[e._v(e._s(e.inputArticle.title))]),e._v(" article? ")]),i("v-divider"),i("v-card-actions",{staticClass:"justify-end"},[i("v-btn",{attrs:{color:"error"},on:{click:e.deleteArticleEmit}},[e._v("Delete")]),i("v-btn",{attrs:{color:"secondary"},on:{click:function(t){e.deleteDialog=!1}}},[e._v("Close")])],1)],1)],1)],1)},n=[],o=i(7632),u={name:"WikiArticle",props:{article:Object,articleItems:Array,categories:Array,clearArticle:Object,level:Number},computed:{articleItemsMinusCurrent(){return this.articleItems.filter((e=>e.id!=this.article.id))}},data(){return{deleteDialog:!1,inputArticle:this.article}},methods:{addArticle(){let e=JSON.parse(JSON.stringify(this.clearArticle));e.id=(0,o.Z)(),this.inputArticle.articles.push(e)},deleteArticle(e){this.inputArticle.articles=this.inputArticle.articles.filter((t=>t.id!=e.id))},deleteArticleEmit(){this.deleteDialog=!1,this.$emit("deleteArticleEmit",this.inputArticle)}}},d=u,p=i(1001),v=i(3453),A=i.n(v),b=i(9511),h=i(3150),m=i(3237),f=i(7118),g=i(5359),k=i(4497),_=i(1418),x=i(6428),y=i(5978),C=i(4350),w=(0,p.Z)(d,s,n,!1,null,null,null),Z=w.exports;A()(w,{VAutocomplete:b.Z,VBtn:h.Z,VCard:m.Z,VCardActions:f.h7,VCardText:f.ZB,VCardTitle:f.EB,VCombobox:g.Z,VDialog:k.Z,VDivider:_.Z,VIcon:x.Z,VTextField:y.Z,VTextarea:C.Z});var V=i(2424),E=i(1881),D={name:"WikiComponent",components:{WikiArticle:Z},created(){this.$signedIn?this.getArticles():this.$router.push({name:"Home"})},computed:{articleItems(){let e=[];return this.articleHolder.articles.forEach((t=>{e=e.concat(this.getArticlesRecursive(t))})),e},categories(){let e=[];return this.articleHolder.articles.forEach((t=>{e=e.concat(this.getCategoriesRecursive(t))})),e}},data(){return{articleHolder:{articles:[]},clearArticle:{id:"",categories:[],title:"",subtitle:"",body:"",articles:[],references:[]}}},methods:{addArticle(){let e=JSON.parse(JSON.stringify(this.clearArticle));e.id=(0,o.Z)(),this.articleHolder.articles.push(e)},deleteArticle(e){this.articleHolder.articles=this.articleHolder.articles.filter((t=>t.id!=e.id))},async getArticles(){this.articles=[];const e=(0,V.IO)((0,V.hJ)(E.db,"articles")),t=await(0,V.PL)(e);t.forEach((e=>{this.articleHolder=e.data()}))},getArticlesRecursive(e){let t=[{id:e.id,title:e.title}];return e.articles.forEach((e=>{t=t.concat(this.getArticlesRecursive(e))})),t},getCategoriesRecursive(e){let t=e.categories;return e.articles.forEach((e=>{t=t.concat(this.getCategoriesRecursive(e))})),t},async saveArticles(){await(0,V.pl)((0,V.JU)(E.db,"articles","1"),this.articleHolder),this.snackbar={show:!0,text:"Articles Saved"}}}},$=D,S=i(3202),H=(0,p.Z)($,c,a,!1,null,null,null),I=H.exports;A()(H,{VBtn:h.Z,VSnackbar:S.Z});var W={name:"WikiView",components:{WikiComponent:I}},O=W,R=(0,p.Z)(O,r,l,!1,null,null,null),J=R.exports}}]);
//# sourceMappingURL=749.8d41606c.js.map