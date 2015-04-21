/*! asmCrypto, (c) 2013 Artem S Vybornov, opensource.org/licenses/MIT */
!function(a,b){function c(){var a=Error.apply(this,arguments);this.message=a.message,this.stack=a.stack}function d(){var a=Error.apply(this,arguments);this.message=a.message,this.stack=a.stack}function e(){var a=Error.apply(this,arguments);this.message=a.message,this.stack=a.stack}function f(a){for(var b=a.length,c=new Uint8Array(b),d=0;b>d;d++){var e=a.charCodeAt(d);if(e>>>8)throw new Error("Wide characters are not allowed");c[d]=e}return c}function g(a){return"string"==typeof a}function h(a){return a instanceof ArrayBuffer}function i(a){return a instanceof Uint8Array}function j(a,b){var c=b.heap,d=c?c.byteLength:b.heapSize||65536;if(4095&d||0>=d)throw new Error("heap size must be a positive integer and a multiple of 4096");return c=c||new a(new ArrayBuffer(d))}function k(a,b,c,d,e){var f=a.length-b,g=e>f?f:e;return a.set(c.subarray(d,d+g),b),g}function l(a){a=a||{},this.heap=j(Uint8Array,a).subarray(z.HEAP_DATA),this.asm=a.asm||z(b,null,this.heap.buffer),this.mode=null,this.key=null,this.reset(a)}function m(a){if(void 0!==a){if(h(a)||i(a))a=new Uint8Array(a);else{if(!g(a))throw new TypeError("unexpected key type");a=f(a)}var b=a.length;if(16!==b&&24!==b&&32!==b)throw new d("illegal key size");var c=new DataView(a.buffer,a.byteOffset,a.byteLength);this.asm.set_key(b>>2,c.getUint32(0),c.getUint32(4),c.getUint32(8),c.getUint32(12),b>16?c.getUint32(16):0,b>16?c.getUint32(20):0,b>24?c.getUint32(24):0,b>24?c.getUint32(28):0),this.key=a}else if(!this.key)throw new Error("key is required")}function n(a){if(void 0!==a){if(h(a)||i(a))a=new Uint8Array(a);else{if(!g(a))throw new TypeError("unexpected iv type");a=f(a)}if(16!==a.length)throw new d("illegal iv size");var b=new DataView(a.buffer,a.byteOffset,a.byteLength);this.iv=a,this.asm.set_iv(b.getUint32(0),b.getUint32(4),b.getUint32(8),b.getUint32(12))}else this.iv=null,this.asm.set_iv(0,0,0,0)}function o(a){this.padding=void 0!==a?!!a:!0}function p(a){return a=a||{},this.result=null,this.pos=0,this.len=0,m.call(this,a.key),this.hasOwnProperty("iv")&&n.call(this,a.iv),this.hasOwnProperty("padding")&&o.call(this,a.padding),this}function q(a){if(g(a)&&(a=f(a)),h(a)&&(a=new Uint8Array(a)),!i(a))throw new TypeError("data isn't of expected type");for(var b=this.asm,c=this.heap,d=z.ENC[this.mode],e=z.HEAP_DATA,j=this.pos,l=this.len,m=0,n=a.length||0,o=0,p=l+n&-16,q=0,r=new Uint8Array(p);n>0;)q=k(c,j+l,a,m,n),l+=q,m+=q,n-=q,q=b.cipher(d,e+j,l),q&&r.set(c.subarray(j,j+q),o),o+=q,l>q?(j+=q,l-=q):(j=0,l=0);return this.result=r,this.pos=j,this.len=l,this}function r(a){var b=null,c=0;void 0!==a&&(b=q.call(this,a).result,c=b.length);var e=this.asm,f=this.heap,g=z.ENC[this.mode],h=z.HEAP_DATA,i=this.pos,j=this.len,k=16-j%16,l=j;if(this.hasOwnProperty("padding")){if(this.padding){for(var m=0;k>m;++m)f[i+j+m]=k;j+=k,l=j}else if(j%16)throw new d("data length must be a multiple of the block size")}else j+=k;var n=new Uint8Array(c+l);return c&&n.set(b),j&&e.cipher(g,h+i,j),l&&n.set(f.subarray(i,i+l),c),this.result=n,this.pos=0,this.len=0,this}function s(a){if(g(a)&&(a=f(a)),h(a)&&(a=new Uint8Array(a)),!i(a))throw new TypeError("data isn't of expected type");var b=this.asm,c=this.heap,d=z.DEC[this.mode],e=z.HEAP_DATA,j=this.pos,l=this.len,m=0,n=a.length||0,o=0,p=l+n&-16,q=0,r=0;this.hasOwnProperty("padding")&&this.padding&&(q=l+n-p||16,p-=q);for(var s=new Uint8Array(p);n>0;)r=k(c,j+l,a,m,n),l+=r,m+=r,n-=r,r=b.cipher(d,e+j,l-(n?0:q)),r&&s.set(c.subarray(j,j+r),o),o+=r,l>r?(j+=r,l-=r):(j=0,l=0);return this.result=s,this.pos=j,this.len=l,this}function t(a){var b=null,c=0;void 0!==a&&(b=s.call(this,a).result,c=b.length);var f=this.asm,g=this.heap,h=z.DEC[this.mode],i=z.HEAP_DATA,j=this.pos,k=this.len,l=k;if(k>0){if(k%16){if(this.hasOwnProperty("padding"))throw new d("data length must be a multiple of the block size");k+=16-k%16}if(f.cipher(h,i+j,k),this.hasOwnProperty("padding")&&this.padding){var m=g[j+l-1];if(1>m||m>16||m>l)throw new e("bad padding");for(var n=0,o=m;o>1;o--)n|=m^g[j+l-o];if(n)throw new e("bad padding");l-=m}}var p=new Uint8Array(c+l);return c>0&&p.set(b),l>0&&p.set(g.subarray(j,j+l),c),this.result=p,this.pos=0,this.len=0,this}function u(a){this.iv=null,l.call(this,a),this.mode="CFB"}function v(a){u.call(this,a)}function w(a){u.call(this,a)}function x(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new u({heap:D,asm:E,key:b,iv:c}).encrypt(a).result}function y(a,b,c){if(void 0===a)throw new SyntaxError("data required");if(void 0===b)throw new SyntaxError("key required");return new u({heap:D,asm:E,key:b,iv:c}).decrypt(a).result}b.asmCrypto=a,c.prototype=Object.create(Error.prototype,{name:{value:"IllegalStateError"}}),d.prototype=Object.create(Error.prototype,{name:{value:"IllegalArgumentError"}}),e.prototype=Object.create(Error.prototype,{name:{value:"SecurityError"}});var z=(b.Float64Array||b.Float32Array,function(){"use strict";function a(){e=[],f=[];var a,b,c=1;for(a=0;255>a;a++)e[a]=c,b=128&c,c<<=1,c&=255,128===b&&(c^=27),c^=e[a],f[e[a]]=a;e[255]=e[0],f[0]=0,k=!0}function b(a,b){var c=e[(f[a]+f[b])%255];return(0===a||0===b)&&(c=0),c}function c(a){var b=e[255-f[a]];return 0===a&&(b=0),b}function d(){function d(a){var b,d,e;for(d=e=c(a),b=0;4>b;b++)d=255&(d<<1|d>>>7),e^=d;return e^=99}k||a(),g=[],h=[],i=[[],[],[],[]],j=[[],[],[],[]];for(var e=0;256>e;e++){var f=d(e);g[e]=f,h[f]=e,i[0][e]=b(2,f)<<24|f<<16|f<<8|b(3,f),j[0][f]=b(14,e)<<24|b(9,e)<<16|b(13,e)<<8|b(11,e);for(var l=1;4>l;l++)i[l][e]=i[l-1][e]>>>8|i[l-1][e]<<24,j[l][f]=j[l-1][f]>>>8|j[l-1][f]<<24}}var e,f,g,h,i,j,k=!1,l=!1,m=function(a,b,c){function e(a,b,c,d,e,h,i,k,l){var n=f.subarray(0,60),o=f.subarray(256,316);n.set([b,c,d,e,h,i,k,l]);for(var p=a,q=1;4*a+28>p;p++){var r=n[p-1];(p%a===0||8===a&&p%a===4)&&(r=g[r>>>24]<<24^g[r>>>16&255]<<16^g[r>>>8&255]<<8^g[255&r]),p%a===0&&(r=r<<8^r>>>24^q<<24,q=q<<1^(128&q?27:0)),n[p]=n[p-a]^r}for(var s=0;p>s;s+=4)for(var t=0;4>t;t++){var r=n[p-(4+s)+(4-t)%4];o[s+t]=4>s||s>=p-4?r:j[0][g[r>>>24]]^j[1][g[r>>>16&255]]^j[2][g[r>>>8&255]]^j[3][g[255&r]]}m.set_rounds(a+5)}l||d();var f=new Uint32Array(c);f.set(g,512),f.set(h,768);for(var k=0;4>k;k++)f.set(i[k],4096+1024*k>>2),f.set(j[k],8192+1024*k>>2);var m=function(a,b,c){"use asm";function d(a,b,c,d,e,f,g,h){a|=0,b|=0,c|=0,d|=0,e|=0,f|=0,g|=0,h|=0;var i=0,j=0,k=0,l=0,m=0,n=0,o=0,p=0;for(i=c|1024,j=c|2048,k=c|3072,e^=T[(a|0)>>2],f^=T[(a|4)>>2],g^=T[(a|8)>>2],h^=T[(a|12)>>2],p=16;(p|0)<=d<<4;p=p+16|0)l=T[(c|e>>22&1020)>>2]^T[(i|f>>14&1020)>>2]^T[(j|g>>6&1020)>>2]^T[(k|h<<2&1020)>>2]^T[(a|p|0)>>2],m=T[(c|f>>22&1020)>>2]^T[(i|g>>14&1020)>>2]^T[(j|h>>6&1020)>>2]^T[(k|e<<2&1020)>>2]^T[(a|p|4)>>2],n=T[(c|g>>22&1020)>>2]^T[(i|h>>14&1020)>>2]^T[(j|e>>6&1020)>>2]^T[(k|f<<2&1020)>>2]^T[(a|p|8)>>2],o=T[(c|h>>22&1020)>>2]^T[(i|e>>14&1020)>>2]^T[(j|f>>6&1020)>>2]^T[(k|g<<2&1020)>>2]^T[(a|p|12)>>2],e=l,f=m,g=n,h=o;y=T[(b|e>>22&1020)>>2]<<24^T[(b|f>>14&1020)>>2]<<16^T[(b|g>>6&1020)>>2]<<8^T[(b|h<<2&1020)>>2]^T[(a|p|0)>>2],z=T[(b|f>>22&1020)>>2]<<24^T[(b|g>>14&1020)>>2]<<16^T[(b|h>>6&1020)>>2]<<8^T[(b|e<<2&1020)>>2]^T[(a|p|4)>>2],A=T[(b|g>>22&1020)>>2]<<24^T[(b|h>>14&1020)>>2]<<16^T[(b|e>>6&1020)>>2]<<8^T[(b|f<<2&1020)>>2]^T[(a|p|8)>>2],B=T[(b|h>>22&1020)>>2]<<24^T[(b|e>>14&1020)>>2]<<16^T[(b|f>>6&1020)>>2]<<8^T[(b|g<<2&1020)>>2]^T[(a|p|12)>>2]}function e(a,b,c,e){a|=0,b|=0,c|=0,e|=0,d(0,2048,4096,S,a,b,c,e)}function f(a,b,c,e){a|=0,b|=0,c|=0,e|=0;var f=0;d(1024,3072,8192,S,a,e,c,b),f=z,z=B,B=f}function g(a,b,c,e){a|=0,b|=0,c|=0,e|=0,d(0,2048,4096,S,C^a,D^b,E^c,F^e),C=y,D=z,E=A,F=B}function h(a,b,c,e){a|=0,b|=0,c|=0,e|=0;var f=0;d(1024,3072,8192,S,a,e,c,b),f=z,z=B,B=f,y^=C,z^=D,A^=E,B^=F,C=a,D=b,E=c,F=e}function i(a,b,c,e){a|=0,b|=0,c|=0,e|=0,d(0,2048,4096,S,C,D,E,F),C=y^=a,D=z^=b,E=A^=c,F=B^=e}function j(a,b,c,e){a|=0,b|=0,c|=0,e|=0,d(0,2048,4096,S,C,D,E,F),y^=a,z^=b,A^=c,B^=e,C=a,D=b,E=c,F=e}function k(a,b,c,e){a|=0,b|=0,c|=0,e|=0,d(0,2048,4096,S,C,D,E,F),C=y,D=z,E=A,F=B,y^=a,z^=b,A^=c,B^=e}function l(a,b,c,e){a|=0,b|=0,c|=0,e|=0,d(0,2048,4096,S,G,H,I,J),J=~N&J|N&J+1,I=~M&I|M&I+((J|0)==0),H=~L&H|L&H+((I|0)==0),G=~K&G|K&G+((H|0)==0),y^=a,z^=b,A^=c,B^=e}function m(a,b,c,d){a|=0,b|=0,c|=0,d|=0;var e=0,f=0,g=0,h=0,i=0,j=0,k=0,l=0,m=0,n=0;for(a^=C,b^=D,c^=E,d^=F,e=O|0,f=P|0,g=Q|0,h=R|0;(m|0)<128;m=m+1|0)e>>>31&&(i^=a,j^=b,k^=c,l^=d),e=e<<1|f>>>31,f=f<<1|g>>>31,g=g<<1|h>>>31,h<<=1,n=d&1,d=d>>>1|c<<31,c=c>>>1|b<<31,b=b>>>1|a<<31,a>>>=1,n&&(a^=3774873600);C=i,D=j,E=k,F=l}function n(a){a|=0,S=a}function o(a,b,c,d){a|=0,b|=0,c|=0,d|=0,y=a,z=b,A=c,B=d}function p(a,b,c,d){a|=0,b|=0,c|=0,d|=0,C=a,D=b,E=c,F=d}function q(a,b,c,d){a|=0,b|=0,c|=0,d|=0,G=a,H=b,I=c,J=d}function r(a,b,c,d){a|=0,b|=0,c|=0,d|=0,K=a,L=b,M=c,N=d}function s(a,b,c,d){a|=0,b|=0,c|=0,d|=0,J=~N&J|N&d,I=~M&I|M&c,H=~L&H|L&b,G=~K&G|K&a}function t(a){return a|=0,a&15?-1:(U[a|0]=y>>>24,U[a|1]=y>>>16&255,U[a|2]=y>>>8&255,U[a|3]=y&255,U[a|4]=z>>>24,U[a|5]=z>>>16&255,U[a|6]=z>>>8&255,U[a|7]=z&255,U[a|8]=A>>>24,U[a|9]=A>>>16&255,U[a|10]=A>>>8&255,U[a|11]=A&255,U[a|12]=B>>>24,U[a|13]=B>>>16&255,U[a|14]=B>>>8&255,U[a|15]=B&255,16)}function u(a){return a|=0,a&15?-1:(U[a|0]=C>>>24,U[a|1]=C>>>16&255,U[a|2]=C>>>8&255,U[a|3]=C&255,U[a|4]=D>>>24,U[a|5]=D>>>16&255,U[a|6]=D>>>8&255,U[a|7]=D&255,U[a|8]=E>>>24,U[a|9]=E>>>16&255,U[a|10]=E>>>8&255,U[a|11]=E&255,U[a|12]=F>>>24,U[a|13]=F>>>16&255,U[a|14]=F>>>8&255,U[a|15]=F&255,16)}function v(){e(0,0,0,0),O=y,P=z,Q=A,R=B}function w(a,b,c){a|=0,b|=0,c|=0;var d=0;if(b&15)return-1;for(;(c|0)>=16;)V[a&7](U[b|0]<<24|U[b|1]<<16|U[b|2]<<8|U[b|3],U[b|4]<<24|U[b|5]<<16|U[b|6]<<8|U[b|7],U[b|8]<<24|U[b|9]<<16|U[b|10]<<8|U[b|11],U[b|12]<<24|U[b|13]<<16|U[b|14]<<8|U[b|15]),U[b|0]=y>>>24,U[b|1]=y>>>16&255,U[b|2]=y>>>8&255,U[b|3]=y&255,U[b|4]=z>>>24,U[b|5]=z>>>16&255,U[b|6]=z>>>8&255,U[b|7]=z&255,U[b|8]=A>>>24,U[b|9]=A>>>16&255,U[b|10]=A>>>8&255,U[b|11]=A&255,U[b|12]=B>>>24,U[b|13]=B>>>16&255,U[b|14]=B>>>8&255,U[b|15]=B&255,d=d+16|0,b=b+16|0,c=c-16|0;return d|0}function x(a,b,c){a|=0,b|=0,c|=0;var d=0;if(b&15)return-1;for(;(c|0)>=16;)W[a&1](U[b|0]<<24|U[b|1]<<16|U[b|2]<<8|U[b|3],U[b|4]<<24|U[b|5]<<16|U[b|6]<<8|U[b|7],U[b|8]<<24|U[b|9]<<16|U[b|10]<<8|U[b|11],U[b|12]<<24|U[b|13]<<16|U[b|14]<<8|U[b|15]),d=d+16|0,b=b+16|0,c=c-16|0;return d|0}var y=0,z=0,A=0,B=0,C=0,D=0,E=0,F=0,G=0,H=0,I=0,J=0,K=0,L=0,M=0,N=0,O=0,P=0,Q=0,R=0,S=0,T=new a.Uint32Array(c),U=new a.Uint8Array(c),V=[e,f,g,h,i,j,k,l],W=[g,m];return{set_rounds:n,set_state:o,set_iv:p,set_nonce:q,set_mask:r,set_counter:s,get_state:t,get_iv:u,gcm_init:v,cipher:w,mac:x}}(a,b,c);return m.set_key=e,m};return m.ENC={ECB:0,CBC:2,CFB:4,OFB:6,CTR:7},m.DEC={ECB:1,CBC:3,CFB:5,OFB:6,CTR:7},m.MAC={CBC:0,GCM:1},m.HEAP_DATA=16384,m}()),A=u.prototype;A.BLOCK_SIZE=16,A.reset=p,A.encrypt=r,A.decrypt=t;var B=v.prototype;B.BLOCK_SIZE=16,B.reset=p,B.process=q,B.finish=r;var C=w.prototype;C.BLOCK_SIZE=16,C.reset=p,C.process=s,C.finish=t;var D=new Uint8Array(1048576),E=z(b,null,D.buffer);a.AES_CFB=u,a.AES_CFB.encrypt=x,a.AES_CFB.decrypt=y,a.AES_CFB.Encrypt=v,a.AES_CFB.Decrypt=w}({},function(){return this}());
//# sourceMappingURL=asmcrypto.js.map