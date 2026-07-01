@import "tailwindcss";
:root {
  --ivory:#F9F7F2; --ivory2:#F2EFE8; --greige:#E8E2D6; --greige2:#D4CCBE; --greige3:#B8AFA0;
  --black:#1A1814; --brown:#A0876A; --brown-light:#B89E87; --brown-bg:#F0E8DF;
  --t1:#1A1814; --t2:#6B6258; --t3:#A09484;
  --border:#E2DBD0; --border2:#EDE8DF; --bg:#F9F7F2; --surface:#FFFFFF;
}
[data-theme="greige"]{--bg:#F0EBE0;--ivory:#F0EBE0;--ivory2:#E8E0D2;--surface:#F8F4EE;}
[data-theme="pink"]{--bg:#FBF5F2;--ivory:#FBF5F2;--ivory2:#F5EAE5;--surface:#FFFFFF;}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;-webkit-tap-highlight-color:transparent;}
html,body{height:100%;background:var(--bg);color:var(--t1);font-family:'Noto Sans JP','Hiragino Sans',sans-serif;font-weight:300;font-size:14px;overscroll-behavior:none;}
button,input,select,textarea{font-family:inherit;font-weight:300;color:inherit;outline:none;-webkit-appearance:none;appearance:none;background:none;border:none;}
input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none;}
img{display:block;max-width:100%;}
a{color:inherit;text-decoration:none;}
@keyframes slideUp{from{transform:translateY(44px);opacity:0}to{transform:translateY(0);opacity:1}}
.sheet-enter{animation:slideUp .22s ease;}
.no-scrollbar::-webkit-scrollbar{display:none;}
.no-scrollbar{-ms-overflow-style:none;scrollbar-width:none;}
