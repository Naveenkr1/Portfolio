/*!
 * Mint, a site cat. One file, no dependencies.
 *
 * Add it to any page, just before </body>:
 *   <script src="site-pet.js" defer></script>
 * or paste this whole file inside a <script> tag.
 *
 * Optional settings (put this BEFORE the script tag):
 *   <script>window.SitePetConfig = { scale: 0.8, hotkey: 'p' };</script>
 *
 * Give any element a custom line when the cat visits it:
 *   <a href="/work" data-pet="ooh, work!">Work</a>
 *
 * The cat lives in a Shadow DOM, so its styles never clash with yours.
 * Zzz colour can be changed with the CSS variable  --sp-zzz  on your :root.
 */
(() => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (window.SitePet) return;

  const CONFIG = Object.assign({
    scale: 0.9,                          // 1 = 68px wide. 0.8 is smaller, 1.3 is bigger
    follow: 130,                       // how far it stays from your cursor (px)
    sleepAfter: 12000,                 // ms of stillness before it yawns and naps
    hoverSelector: 'a,button,[data-pet]', // elements it runs over to inspect
    hotkey: null,                      // e.g. 'p' to hide/show the cat with a key
    greeting: 'mrrp.',                 // bubble shown on load, '' for none
    minWidth: 0                        // e.g. 700 to hide the cat on small screens
  }, window.SitePetConfig || {});

  if (CONFIG.minWidth && innerWidth < CONFIG.minWidth) return;

  const CSS = `
:host{all:initial;font-family:system-ui,-apple-system,'Segoe UI',Roboto,sans-serif}
/* ================= PET ================= */
.pet{position:fixed;left:0;top:0;transform-origin:0 0;width:68px;height:70px;z-index:9999;touch-action:none;cursor:grab;user-select:none;-webkit-user-select:none;will-change:transform;
  --tw1:-6;--tw2:10}
.pet.held{cursor:grabbing}
.pet svg{display:block;overflow:visible;width:68px;height:70px}
.shadow-svg{position:absolute;left:0;top:0;pointer-events:none}
.shadow-svg path{transform-box:fill-box;transform-origin:center;transition:transform .2s}
.tilt,.anim{width:100%;height:100%;transform-origin:50% 92%}

.torso,.foot,.ear,.tail,.wh,.nose,.m-open,.dz,.paw{transform-box:fill-box}
.torso{transform-origin:50% 100%;transition:transform .25s}
.ear{transition:transform .2s}
.ear-l{transform-origin:55% 95%}.ear-r{transform-origin:45% 95%}
.foot{transform-origin:50% 100%;transition:transform .2s}
.tail{transform-origin:0% 82%;animation:tailsway 3.4s ease-in-out infinite alternate;cursor:pointer;pointer-events:all}
.wl{transform-origin:100% 50%}.wr{transform-origin:0% 50%}
.wh{transition:transform .2s}
.nose{transform-origin:center}
.paw{display:none;transform-origin:50% 100%}
.eye{transform-box:fill-box;transform-origin:center;transition:transform .12s}
.eyes{transform:translate(calc(var(--lx,0)*12px),calc(var(--ly,0)*8px))}
.snout{transform:translate(calc(var(--lx,0)*6px),calc(var(--ly,0)*4px))}
.whiskers{transform:translate(calc(var(--lx,0)*3px),calc(var(--ly,0)*2px))}
.eyes-open{transform-box:fill-box;transform-origin:center}
.eyes-open.blink{animation:blink .16s}
.eyes-open.slow{animation:slowblink 1.1s ease-in-out}
.eyes-closed,.eyes-happy,.eyes-dizzy,.m-smile,.m-open,.m-o{display:none}
.ink{stroke:#092A3B;fill:none;stroke-linecap:round;stroke-linejoin:round}
.dz{transform-origin:center;animation:spinr .6s linear infinite}

/* ---- expressions ---- */
.pet:is([data-state=sleep],[data-state=yawn],[data-state=stretch],[data-state=groom],[data-state=dizzy],[data-state=happy],[data-state=rub],[data-state=eat]) .eyes-open,
.pet:is([data-state=idle],[data-state=sit],[data-state=walk]):hover .eyes-open{display:none}
.pet:is([data-state=sleep],[data-state=yawn],[data-state=stretch],[data-state=groom]) .eyes-closed{display:inline}
.pet[data-state=dizzy] .eyes-dizzy{display:inline}
.pet:is([data-state=happy],[data-state=rub],[data-state=eat]) .eyes-happy,
.pet:is([data-state=idle],[data-state=sit],[data-state=walk]):hover .eyes-happy{display:inline}
.pet:is([data-state=eat],[data-state=yawn]) .m-open{display:inline}
.pet:is([data-state=held],[data-state=dizzy],[data-state=startle]) .m-o{display:inline}
.pet:is([data-state=happy],[data-state=rub],[data-state=groom]) .m-smile,
.pet:is([data-state=idle],[data-state=sit],[data-state=walk]):hover .m-smile{display:inline}
.pet:is([data-state=curious],[data-state=startle],[data-state=held],[data-state=crouch]) .eye{transform:scale(1.18)}
.pet[data-state=annoyed] .eye{transform:scaleY(.45)}
.pet[data-state=annoyed] .eye.eye-l{transform:scaleY(.42) rotate(16deg)}
.pet[data-state=annoyed] .eye.eye-r{transform:scaleY(.42) rotate(-16deg)}
.pet:is([data-state=held],[data-state=dizzy],[data-state=startle],[data-state=annoyed]) .m-o{display:inline}

/* ---- idle / sit / loaf ---- */
.pet[data-state=idle] .torso{animation:breathe 3.4s ease-in-out infinite}
.pet[data-state=sit]{--tw1:30;--tw2:38}
.pet[data-state=sit] .torso{transform:translateY(10px) scale(1.01,.98);animation:none}
.pet[data-state=sit] .foot{transform:scaleY(.88)}
.pet[data-state=sit] .tail{animation-duration:4s}
.pet[data-state=sleep]{--tw1:44;--tw2:48}
.pet[data-state=sleep] .torso{transform:translateY(30px) scale(1.12,.82);animation:loafbreath 3.6s ease-in-out infinite}
.pet[data-state=sleep] .foot{transform:scaleY(.4)}
.pet[data-state=sleep] .ear-l{transform:rotate(-12deg)}
.pet[data-state=sleep] .ear-r{transform:rotate(12deg)}
.pet[data-state=sleep] .tail{animation-duration:7s}

/* ---- walk (graceful) & run (gallop) ---- */
.pet[data-state=walk]{--wd:.42s;--bob:5;--lift:14;--rock:1.5;--flap:4;--wf:4;--tw1:-30;--tw2:-18}
.pet[data-state=run]{--wd:.2s;--bob:15;--lift:28;--rock:2;--flap:14;--wf:12;--tw1:-14;--tw2:-4}
.pet:is([data-state=walk],[data-state=run]) .torso{animation:waddle var(--wd) ease-in-out infinite}
.pet:is([data-state=walk],[data-state=run]) .foot-l{animation:step var(--wd) ease-in-out infinite}
.pet:is([data-state=walk],[data-state=run]) .foot-r{animation:step var(--wd) ease-in-out infinite;animation-delay:calc(var(--wd)/-2)}
.pet:is([data-state=walk],[data-state=run]) .ear-l{animation:earl calc(var(--wd)/2) ease-in-out infinite alternate}
.pet:is([data-state=walk],[data-state=run]) .ear-r{animation:earr calc(var(--wd)/2) ease-in-out infinite alternate}
.pet:is([data-state=walk],[data-state=run]) .wl{animation:wfl calc(var(--wd)/2) ease-in-out infinite alternate}
.pet:is([data-state=walk],[data-state=run]) .wr{animation:wfr calc(var(--wd)/2) ease-in-out infinite alternate}
.pet:is([data-state=walk],[data-state=run]) .tail{animation-duration:calc(var(--wd)*3)}
.pet:is([data-state=walk],[data-state=run]) .shadow-svg path{animation:shstep calc(var(--wd)/2) ease-in-out infinite alternate}

/* ---- curious / startle / stalk ---- */
.pet[data-state=curious]{--tw1:-22;--tw2:-10}
.pet[data-state=curious] .torso{transform:rotate(-5deg)}
.pet:is([data-state=curious],[data-state=startle],[data-state=held]) .ear{transform:translateY(-9px) scaleY(1.1)}
.pet[data-state=curious] .wl{transform:rotate(10deg)}
.pet[data-state=curious] .wr{transform:rotate(-10deg)}
.pet[data-state=startle] .torso{transform:scale(.96,1.08)}
.pet[data-state=startle] .tail{animation:none;transform:rotate(-12deg) scale(1.2)}
.pet[data-state=startle] .wl{transform:rotate(16deg)}
.pet[data-state=startle] .wr{transform:rotate(-16deg)}
.pet[data-state=crouch] .torso{animation:stalk .12s ease-in-out infinite alternate}
.pet[data-state=crouch] .foot{transform:scaleY(.78)}
.pet[data-state=crouch] .ear-l{transform:rotate(-12deg)}
.pet[data-state=crouch] .ear-r{transform:rotate(12deg)}
.pet[data-state=crouch] .tail{animation-duration:.16s;--tw1:-24;--tw2:24}

/* ---- purr / rub / eat ---- */
.pet:is([data-state=happy],[data-state=rub]){--tw1:-38;--tw2:-26}
.pet:is([data-state=happy],[data-state=rub]) .tail{animation-duration:1.2s}
.pet[data-state=happy] .torso{animation:purr .09s linear infinite alternate}
.pet:is([data-state=happy],[data-state=rub]) .ear{transform:translateY(-4px) scaleY(1.04)}
.pet[data-state=rub] .torso{animation:rub .6s ease-in-out infinite alternate}
.pet[data-state=eat] .torso{animation:munch .22s ease-in-out infinite alternate}
.pet[data-state=eat] .m-open{transform-origin:50% 0%;animation:chomp .22s ease-in-out infinite alternate}

/* ---- groom / stretch / yawn ---- */
.pet[data-state=groom] .torso{transform:translateY(8px) rotate(-4deg)}
.pet[data-state=groom] .ear-l{transform:rotate(-8deg)}
.pet[data-state=groom] .paw-r{display:inline;animation:groom .42s ease-in-out infinite alternate}
.pet[data-state=stretch]{--tw1:-42;--tw2:-36}
.pet[data-state=stretch] .torso{transform:translateY(24px) scale(1.18,.8)}
.pet[data-state=stretch] .foot{transform:scaleY(.85)}
.pet[data-state=stretch] .ear{transform:rotate(0) translateY(4px)}
.pet[data-state=stretch] .ear-l{transform:rotate(-14deg)}
.pet[data-state=stretch] .ear-r{transform:rotate(14deg)}
.pet[data-state=yawn] .torso{animation:yawnbody 1.4s ease-in-out}
.pet[data-state=yawn] .m-open{transform-origin:50% 0%;animation:yawn 1.4s ease-in-out}
.pet[data-state=yawn] .ear-l{transform:rotate(-8deg)}
.pet[data-state=yawn] .ear-r{transform:rotate(8deg)}

/* ---- swat ---- */
.pet[data-state=swat] .torso{transform:translateY(14px) scale(1.04,.94)}
.pet[data-state=swat][data-side=r] .torso{transform:translateY(14px) rotate(5deg) scale(1.04,.94)}
.pet[data-state=swat][data-side=l] .torso{transform:translateY(14px) rotate(-5deg) scale(1.04,.94)}
.pet[data-state=swat][data-side=r] .paw-r{display:inline;animation:swatr .45s ease-out forwards}
.pet[data-state=swat][data-side=l] .paw-l{display:inline;animation:swatl .45s ease-out forwards}

/* ---- annoyed / held / dizzy ---- */
.pet[data-state=annoyed] .torso{transform:translateY(4px) scale(1.02,.97)}
.pet[data-state=annoyed] .ear-l{transform:rotate(-24deg) translateY(6px)}
.pet[data-state=annoyed] .ear-r{transform:rotate(24deg) translateY(6px)}
.pet[data-state=annoyed] .wl{transform:rotate(-14deg)}
.pet[data-state=annoyed] .wr{transform:rotate(14deg)}
.pet[data-state=annoyed] .tail{animation-duration:.12s;--tw1:-34;--tw2:34}
.pet[data-state=held] .torso{animation:heldsway .7s ease-in-out infinite alternate}
.pet[data-state=held] .foot{transform-origin:50% 0%}
.pet[data-state=held] .foot-l{animation:dangle .45s ease-in-out infinite alternate}
.pet[data-state=held] .foot-r{animation:dangle .45s ease-in-out infinite alternate;animation-delay:-.22s}
.pet[data-state=held] .tail{animation-duration:.6s}
.pet[data-state=held] .wl{animation:wfl .2s ease-in-out infinite alternate;--wf:10}
.pet[data-state=held] .wr{animation:wfr .2s ease-in-out infinite alternate;--wf:10}
.pet[data-state=dizzy] .torso{animation:wobble .7s ease-in-out infinite alternate}
.pet[data-state=dizzy] .tail{animation:none;transform:rotate(16deg)}
.pet[data-state=dizzy] .ear-l{transform:rotate(-8deg)}
.pet[data-state=dizzy] .ear-r{transform:rotate(8deg)}

/* ---- hover on the pet itself ---- */
.pet:hover .ear-l{animation:earwig .3s ease-in-out 2}
.pet:hover .ear-r{animation:earwig .3s ease-in-out 2 reverse}

/* ---- one-shot fx ---- */
.anim.hop{animation:hop .5s ease-out}
.anim.squish{animation:squish .38s ease-out}
.pet[data-fx=hop] .shadow-svg path{animation:shhop .5s ease-out}
.ear.twitch{animation:twitch .26s ease-in-out}
.nose.sniff{animation:sniff .45s ease-in-out}

/* ---- overlays ---- */
.zzz,.stars{position:absolute;display:none;pointer-events:none}
.zzz{right:-4px;top:0;font-weight:800;color:var(--sp-zzz,#64ffda)}
.zzz b{position:absolute;font-size:12px;opacity:0;animation:zfloat 2.2s ease-out infinite}
.zzz b:nth-child(2){animation-delay:.7s;font-size:14px}
.zzz b:nth-child(3){animation-delay:1.4s;font-size:17px}
.pet[data-state=sleep] .zzz{display:block}
.stars{left:50%;top:6px;width:0;height:0;animation:spinr 1.2s linear infinite}
.stars i{position:absolute;font-style:normal;font-size:12px;color:#F5B83D}
.stars i:nth-child(1){left:-24px;top:0}.stars i:nth-child(2){left:18px;top:-3px}.stars i:nth-child(3){left:-3px;top:-14px}
.pet[data-state=dizzy] .stars{display:block}
.bubble{position:absolute;left:50%;bottom:calc(100% + 2px);transform:translate(-50%,6px) scale(.8);opacity:0;transition:opacity .18s,transform .18s;
  background:#fff;color:#092A3B;border:2px solid #092A3B;border-radius:12px;padding:3px 10px;font-size:13px;font-weight:600;white-space:nowrap;pointer-events:none}
.bubble::after{content:"";position:absolute;left:50%;bottom:-6px;width:8px;height:8px;background:#fff;border-right:2px solid #092A3B;border-bottom:2px solid #092A3B;transform:translateX(-50%) rotate(45deg)}
.bubble.show{opacity:1;transform:translate(-50%,0) scale(1)}
.pet[data-parked="left"] .bubble,.pet[data-bubble-edge="left"] .bubble{left:0;transform:translate(0,6px) scale(.8)}
.pet[data-parked="left"] .bubble.show,.pet[data-bubble-edge="left"] .bubble.show{transform:translate(0,0) scale(1)}
.pet[data-parked="left"] .bubble::after,.pet[data-bubble-edge="left"] .bubble::after{left:24px}
.pet[data-parked="right"] .bubble,.pet[data-bubble-edge="right"] .bubble{left:auto;right:0;transform:translate(0,6px) scale(.8)}
.pet[data-parked="right"] .bubble.show,.pet[data-bubble-edge="right"] .bubble.show{transform:translate(0,0) scale(1)}
.pet[data-parked="right"] .bubble::after,.pet[data-bubble-edge="right"] .bubble::after{left:auto;right:24px}
.pet[data-bubble-top="1"] .bubble{bottom:auto;top:calc(100% + 4px)}
.pet[data-bubble-top="1"] .bubble::after{bottom:auto;top:-6px;border-right:none;border-bottom:none;border-left:2px solid #092A3B;border-top:2px solid #092A3B}
.fx{position:fixed;pointer-events:none;z-index:9998;font-size:16px;line-height:1;color:var(--c);animation:floatup .9s ease-out forwards;will-change:transform,opacity}
.berry{position:fixed;z-index:9990;width:18px;height:18px;margin:-9px 0 0 -9px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FF8FA3,#E8335A 70%);box-shadow:0 2px 0 rgba(0,0,0,.2);animation:pop .3s cubic-bezier(.3,1.6,.5,1);pointer-events:none}
.berry::before{content:"";position:absolute;left:6px;top:-5px;width:6px;height:6px;border-radius:0 100% 0 100%;background:#22D2B6}

/* ---- keyframes ---- */
@keyframes tailsway{from{transform:rotate(calc(var(--tw1)*1deg))}to{transform:rotate(calc(var(--tw2)*1deg))}}
@keyframes breathe{50%{transform:scale(1.014,.986)}}
@keyframes loafbreath{0%,100%{transform:translateY(30px) scale(1.12,.82)}50%{transform:translateY(30px) scale(1.13,.845)}}
@keyframes waddle{
  0%{transform:translateY(0) rotate(calc(var(--rock)*-1deg))}
  25%{transform:translateY(calc(var(--bob)*-1px)) rotate(0)}
  50%{transform:translateY(0) rotate(calc(var(--rock)*1deg))}
  75%{transform:translateY(calc(var(--bob)*-1px)) rotate(0)}
  100%{transform:translateY(0) rotate(calc(var(--rock)*-1deg))}}
@keyframes step{0%,50%,100%{transform:translateY(0)}25%{transform:translateY(calc(var(--lift)*-1px))}}
@keyframes earl{from{transform:rotate(0)}to{transform:rotate(calc(var(--flap)*-1deg))}}
@keyframes earr{from{transform:rotate(0)}to{transform:rotate(calc(var(--flap)*1deg))}}
@keyframes wfl{from{transform:rotate(0)}to{transform:rotate(calc(var(--wf)*1deg))}}
@keyframes wfr{from{transform:rotate(0)}to{transform:rotate(calc(var(--wf)*-1deg))}}
@keyframes shstep{from{transform:scale(1)}to{transform:scale(.9,.82)}}
@keyframes stalk{from{transform:translateY(32px) translateX(-5px) scale(1.07,.8)}to{transform:translateY(32px) translateX(5px) scale(1.07,.8)}}
@keyframes purr{from{transform:translate(-3px,0) scale(1.005,.995)}to{transform:translate(3px,0) scale(.995,1.005)}}
@keyframes rub{from{transform:translateX(-12px) rotate(-6deg)}to{transform:translateX(12px) rotate(6deg)}}
@keyframes munch{from{transform:translateY(0)}to{transform:translateY(5px) scale(1.02,.98)}}
@keyframes chomp{from{transform:scaleY(.3)}to{transform:scaleY(1)}}
@keyframes yawnbody{0%,100%{transform:translateY(0) scale(1)}35%,65%{transform:translateY(-8px) scale(.97,1.06)}}
@keyframes yawn{0%,100%{transform:scaleY(0)}30%,65%{transform:scaleY(1.3)}}
@keyframes groom{from{transform:translate(-62px,-150px) scale(.6) rotate(-8deg)}to{transform:translate(-62px,-192px) scale(.6) rotate(-22deg)}}
@keyframes swatr{0%{transform:translate(-30px,-130px) scale(.62) rotate(-25deg)}35%{transform:translate(30px,-170px) scale(.7) rotate(15deg)}70%,100%{transform:translate(95px,-70px) scale(.72) rotate(70deg)}}
@keyframes swatl{0%{transform:translate(30px,-130px) scale(.62) rotate(25deg)}35%{transform:translate(-30px,-170px) scale(.7) rotate(-15deg)}70%,100%{transform:translate(-95px,-70px) scale(.72) rotate(-70deg)}}
@keyframes heldsway{from{transform:rotate(-4deg)}to{transform:rotate(4deg)}}
@keyframes dangle{from{transform:translateY(8px) rotate(-12deg)}to{transform:translateY(12px) rotate(12deg)}}
@keyframes wobble{from{transform:rotate(-7deg) translateX(-4px)}to{transform:rotate(7deg) translateX(4px)}}
@keyframes earwig{50%{transform:rotate(-14deg)}}
@keyframes twitch{50%{transform:rotate(-12deg)}}
@keyframes sniff{0%,100%{transform:scale(1)}30%{transform:scale(1.12,1.18)}60%{transform:scale(.96)}}
@keyframes blink{50%{transform:scaleY(.1)}}
@keyframes slowblink{0%,100%{transform:scaleY(1)}35%,65%{transform:scaleY(.08)}}
@keyframes hop{0%{transform:translateY(0) scale(1.1,.88)}35%{transform:translateY(-22px) scale(.92,1.1)}70%{transform:translateY(0) scale(1.12,.88)}100%{transform:translateY(0) scale(1)}}
@keyframes squish{0%{transform:scale(1.2,.76)}55%{transform:scale(.92,1.1)}100%{transform:scale(1)}}
@keyframes shhop{35%{transform:scale(.6,.55)}}
@keyframes spinr{to{transform:rotate(360deg)}}
@keyframes zfloat{0%{transform:translate(0,8px);opacity:0}25%{opacity:1}100%{transform:translate(10px,-18px);opacity:0}}
@keyframes floatup{from{transform:translate(0,0) scale(.6);opacity:1}to{transform:translate(var(--dx),var(--dy)) scale(1.1) rotate(var(--r));opacity:0}}
@keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){
  .pet *,.berry{animation:none!important}
  .fx{animation-duration:.5s}
}

`;

  const HTML = `
<div class="pet" id="pet" data-state="idle" aria-hidden="true">
  <svg class="shadow-svg" viewBox="-8 -14 466 480" fill="none"><path d="M185 454.368C287.173 454.368 370 441.832 370 426.368C370 410.904 287.173 398.368 185 398.368C82.8273 398.368 0 410.904 0 426.368C0 441.832 82.8273 454.368 185 454.368Z" fill="#000" fill-opacity="0.1"/></svg>
  <div class="tilt" id="tilt"><div class="anim" id="anim">
    <svg class="sprite" viewBox="-8 -14 466 480" fill="none">
      <g class="tail" id="tail">
        <path d="M289 343.283C354 353.283 391 313.283 390 275.283C389 247.283 417 240.283 430 258.283C450 286.283 421 340.283 383 367.283C351 389.283 311 385.283 289 375.283V343.283Z" fill="#43DFC7"/>
        <path d="M289 343.283C354 353.283 391 313.283 390 275.283C389 247.283 417 240.283 430 258.283C450 286.283 421 340.283 383 367.283C351 389.283 311 385.283 289 375.283V343.283Z" stroke="transparent" stroke-width="45" stroke-linecap="round" fill="none" pointer-events="all"/>
      </g>
      <g class="foot foot-l"><path d="M160 337.368H89C81.8203 337.368 76 344.274 76 352.794V410.941C76 419.461 81.8203 426.368 89 426.368H160C167.18 426.368 173 419.461 173 410.941V352.794C173 344.274 167.18 337.368 160 337.368Z" fill="#22D2B6"/></g>
      <g class="foot foot-r"><path d="M282 337.368H211C203.82 337.368 198 344.274 198 352.794V410.941C198 419.461 203.82 426.368 211 426.368H282C289.18 426.368 295 419.461 295 410.941V352.794C295 344.274 289.18 337.368 282 337.368Z" fill="#22D2B6"/></g>
      <g class="torso">
        <g class="ear ear-l">
          <path d="M60 110.368L62 22.3676C64 -3.63235 76 -6.96569 98 12.3676L162 74.3676L60 110.368Z" fill="#37E7CE"/>
          <path d="M79 58.3677L81 25.3677C82.3333 18.7011 86.6667 19.3677 94 27.3677L132 67.3677L79 58.3677Z" fill="#079D84"/>
        </g>
        <g class="ear ear-r">
          <path d="M308 110.368L306 22.3676C304 -3.63235 292 -6.96569 270 12.3676L206 74.3676L308 110.368Z" fill="#37E7CE"/>
          <path d="M289 58.3677L287 25.3677C285.667 18.7011 281.333 19.3677 274 27.3677L236 67.3677L289 58.3677Z" fill="#079D84"/>
        </g>
        <path d="M294 57.3677H76C52.2518 57.3677 33 76.6194 33 100.368V314.368C33 338.116 52.2518 357.368 76 357.368H294C317.748 357.368 337 338.116 337 314.368V100.368C337 76.6194 317.748 57.3677 294 57.3677Z" fill="#45F0D5"/>
        <path opacity="0.85" d="M52 102.368C54 83.701 64 74.3677 82 74.3677" stroke-width="13" stroke-linecap="round" stroke="#8CFFEC"/>
        <g class="face">
          <g class="eyes" id="eyes">
            <g class="eyes-open" id="eyesOpen">
              <rect class="eye eye-l" x="108" y="183.368" width="34" height="35" rx="5" fill="#092A3B"/>
              <rect class="eye eye-r" x="250" y="183.368" width="34" height="35" rx="5" fill="#092A3B"/>
            </g>
            <g class="eyes-closed">
              <path class="ink" stroke-width="9" d="M104 202 Q125 218 146 202"/><path class="ink" stroke-width="9" d="M246 202 Q267 218 288 202"/>
            </g>
            <g class="eyes-happy">
              <path class="ink" stroke-width="10" d="M105 210 Q125 182 145 210"/><path class="ink" stroke-width="10" d="M247 210 Q267 182 287 210"/>
            </g>
            <g class="eyes-dizzy">
              <g class="dz"><circle class="ink" cx="125" cy="200" r="21" stroke-width="7" stroke-dasharray="40 24"/></g>
              <g class="dz"><circle class="ink" cx="267" cy="200" r="21" stroke-width="7" stroke-dasharray="40 24"/></g>
              <circle cx="125" cy="200" r="5" fill="#092A3B"/><circle cx="267" cy="200" r="5" fill="#092A3B"/>
            </g>
          </g>
          <g class="snout">
            <rect class="nose" id="nose" x="173" y="223.368" width="38" height="25" rx="7" fill="#0FB69C"/>
            <path class="ink m-smile" stroke-width="6" d="M166 254 Q192 276 218 254"/>
            <g class="m-open"><path d="M168 252 Q192 296 216 252Z" fill="#092A3B" stroke="#092A3B" stroke-width="5" stroke-linejoin="round"/><path d="M180 272 Q192 286 204 272 Q192 264 180 272Z" fill="#FF8FA3"/></g>
            <ellipse class="m-o" cx="192" cy="264" rx="12" ry="15" fill="#092A3B"/>
          </g>
          <g class="whiskers">
            <path class="wh wl" stroke="#092A3B" stroke-width="6" stroke-linecap="round" d="M50 227.368H86"/>
            <path class="wh wl" stroke="#092A3B" stroke-width="6" stroke-linecap="round" d="M50 251.368H86"/>
            <path class="wh wr" stroke="#092A3B" stroke-width="6" stroke-linecap="round" d="M284 227.368H320"/>
            <path class="wh wr" stroke="#092A3B" stroke-width="6" stroke-linecap="round" d="M284 251.368H320"/>
          </g>
        </g>
      </g>
      <g class="paw paw-l"><path d="M160 337.368H89C81.8203 337.368 76 344.274 76 352.794V410.941C76 419.461 81.8203 426.368 89 426.368H160C167.18 426.368 173 419.461 173 410.941V352.794C173 344.274 167.18 337.368 160 337.368Z" fill="#22D2B6"/></g>
      <g class="paw paw-r"><path d="M282 337.368H211C203.82 337.368 198 344.274 198 352.794V410.941C198 419.461 203.82 426.368 211 426.368H282C289.18 426.368 295 419.461 295 410.941V352.794C295 344.274 289.18 337.368 282 337.368Z" fill="#22D2B6"/></g>
    </svg>
  </div></div>
  <div class="zzz"><b>z</b><b>z</b><b>Z</b></div>
  <div class="stars"><i>✦</i><i>✦</i><i>✦</i></div>
  <div class="bubble" id="bubble"></div>
</div>
`;

  function init() {
    let destroyed = false;
    let rafId = null;
    const abortController = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const signal = abortController ? abortController.signal : undefined;

    const host = document.createElement('div');
    host.id = 'site-pet-host';
    host.setAttribute('aria-hidden', 'true');
    const root = host.attachShadow({ mode: 'open' });
    root.innerHTML = '<style>' + CSS + '</style>' + HTML;
    document.body.appendChild(host);

    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const $ = s => root.querySelector(s);
    const isPet = e => e.composedPath().includes(pet);
    const pet = $('#pet'), tilt = $('#tilt'), anim = $('#anim'), bubble = $('#bubble'), eyesOpen = $('#eyesOpen'), nose = $('#nose');
    const ears = [...root.querySelectorAll('.ear')];

    // ---- tuning (see CONFIG at the top of the file) ----
    const S = CONFIG.scale;
    const FOLLOW = CONFIG.follow;
    const SLEEP_AFTER = CONFIG.sleepAfter;
    const MAXV = 22;
    const HX = 34 * S, HY = 35 * S;
    const BOTTOM = 36 * S;
    const STILL = new Set(['sleep', 'sit', 'crouch', 'curious', 'held', 'dizzy', 'groom', 'stretch', 'yawn', 'rub']);

    const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
    const rand = (a, b) => a + Math.random() * (b - a);
    const pick = a => a[Math.floor(Math.random() * a.length)];
    const now = () => performance.now();

    let W = innerWidth, H = innerHeight;

    function isCaseStudyPage() {
      if (typeof window === 'undefined') return false;
      const path = (window.location && window.location.pathname) || '';
      if (path.includes('/case-study') || path.includes('/ai-lab') || path.includes('/ai.lab') || path.includes('preview')) {
        return true;
      }
      return !!document.querySelector('[class*="StyledCaseStudyContainer"], [class*="StyledAILabHeader"]');
    }

    function getTOCBounds() {
      W = innerWidth;
      const tocEl = document.querySelector('aside, [class*="StyledSidebar"], [class*="StyledTOC"], [class*="StyledTOCInner"], .toc-reveal');
      if (tocEl) {
        const r = tocEl.getBoundingClientRect();
        if (r.width > 0 && r.right > 100) {
          const minX = clamp(Math.min(r.left, HX + 24), HX + 16, r.right - HX - 30);
          const maxX = clamp(r.right - HX - 8, minX + 60, W - HX - 20);
          return { minX, maxX };
        }
      }
      // Fallback if TOC element is not yet rendered or on AI lab single column
      const fallbackEnd = Math.min(360, W * 0.35);
      const minX = HX + 24;
      const maxX = clamp(fallbackEnd - HX - 8, minX + 60, W - HX - 20);
      return { minX, maxX };
    }

    function getLeftParkPosition() {
      W = innerWidth;
      H = innerHeight;
      const { minX } = getTOCBounds();
      return {
        x: minX,
        y: H - BOTTOM
      };
    }

    function getEmailPosition() {
      W = innerWidth;
      H = innerHeight;

      // 1. Specifically look for the email side element:
      // Either by email__StyledLinkWrapper or email__Styled
      const sideEmail = document.querySelector('[class*="email__StyledLinkWrapper"], [class*="email__Styled"]');
      if (sideEmail) {
        const sideParent = sideEmail.closest('[class*="StyledSideElement"]') || sideEmail;
        const r = sideParent.getBoundingClientRect();
        if (r.width > 0 && r.left > 0) {
          return {
            x: clamp(r.left - HX - 14, HX + 8, W - HX - 8),
            y: H - BOTTOM,
            found: true
          };
        }
      }

      // 2. Look for the right-hand StyledSideElement (the fixed side container for email)
      const sides = document.querySelectorAll('[class*="StyledSideElement"]');
      for (const s of sides) {
        const r = s.getBoundingClientRect();
        if (r.width > 0 && r.left > W * 0.5) {
          return {
            x: clamp(r.left - HX - 14, HX + 8, W - HX - 8),
            y: H - BOTTOM,
            found: true
          };
        }
      }

      // 3. Fallback: calculate using standard side email layout (40px or 20px margin + 40px width)
      const rightMargin = (W <= 1080) ? 20 : 40;
      const emailLeft = W - rightMargin - 40;
      return {
        x: clamp(emailLeft - HX - 14, HX + 8, W - HX - 8),
        y: H - BOTTOM,
        found: false
      };
    }

    function getInitialParkPosition() {
      if (isCaseStudyPage()) {
        const pos = getLeftParkPosition();
        return {
          x: pos.x,
          y: pos.y,
          isLeft: true
        };
      }
      const pos = getEmailPosition();
      return {
        x: pos.x,
        y: pos.y,
        isLeft: false
      };
    }

    const initPark = getInitialParkPosition();
    const P = { x: initPark.x, y: initPark.y, vx: 0, vy: 0 };
    const M = { x: W * 0.5, y: H * 0.4 };

    let state = 'sit', asleep = false, held = false, away = false, hidden = false, walkFlag = false, runFlag = false;
    let isParked = true,
        parkedSide = initPark.isLeft ? 'left' : null,
        parkedAtEmail = !initPark.isLeft,
        parkedAt = now(),
        justDropped = false;
    let patrolDir = 1, patrolPauseUntil = initPark.isLeft ? now() + 600 : 0;
    let lastScrollReaction = 0, parkSleepTimer = null;
    if (initPark.isLeft) {
      pet.dataset.parked = 'left';
    }

    function parkAtLeft() {
      W = innerWidth; H = innerHeight;
      isParked = true;
      parkedSide = 'left';
      parkedAtEmail = false;
      pet.dataset.parked = 'left';
      const pos = getLeftParkPosition();
      P.x = pos.x;
      P.y = pos.y;
      P.vx = 0; P.vy = 0;
      asleep = false;
      patrolDir = 1;
      patrolPauseUntil = now() + 600;
    }

    function parkAtEmail() {
      W = innerWidth; H = innerHeight;
      isParked = true;
      parkedSide = null;
      parkedAtEmail = true;
      delete pet.dataset.parked;
      const pos = getEmailPosition();
      P.x = pos.x;
      P.y = pos.y;
      P.vx = 0; P.vy = 0;
      scheduleParkSleep(2600, true);
    }

    function scheduleParkSleep(delay = 3200, silent = false) {
      if (!isParked) return;
      clearTimeout(parkSleepTimer);
      parkSleepTimer = setTimeout(() => {
        if (isParked && !held && !drag) {
          forced = { s: 'sit', until: now() + 600, auto: true, then: 'sleep' };
          play('squish');
          if (!silent) {
            say(pick(['*curls up*', 'zzz', 'nap time...']), 1400);
          }
          setTimeout(() => {
            if (isParked && !held && !drag) {
              asleep = true;
              if (!silent) {
                burst(P.x, P.y - 25 * S, ['✨'], 2);
              }
            }
          }, 600);
        }
      }, delay);
    }

    let hoverEl = null, hoverTimer = 0, bubbleTimer = 0, hoverSince = 0, hoverBig = false;
    let dizzyUntil = 0, happyUntil = 0, eatUntil = 0, startleUntil = 0, annoyedUntil = 0, swatUntil = 0, aloofUntil = 0;
    let pounce = null, roam = null, forced = null, zoomies = null;
    let lastActive = now(), stillSince = now(), nextAct = now() + 6000, huntCool = 0, rubHeart = 0, wakeAcc = 0;
    let lastX = M.x, lastY = M.y, prevX = M.x, prevY = M.y, prevT = now(), curSpeed = 0, lastSign = 0, reversals = [];
    let treats = [], pokes = [], drag = null, lookX = 0, lookY = 0, lastScroll = scrollY, last = now();

    /* ---------- helpers ---------- */
    function say(text, ms = 1500) {
      bubble.textContent = text;
      if (P.x < 110) pet.dataset.bubbleEdge = 'left';
      else if (P.x > W - 110) pet.dataset.bubbleEdge = 'right';
      else delete pet.dataset.bubbleEdge;

      if (P.y < 70) pet.dataset.bubbleTop = '1';
      else delete pet.dataset.bubbleTop;

      bubble.classList.add('show');
      clearTimeout(bubbleTimer);
      bubbleTimer = setTimeout(() => {
        bubble.classList.remove('show');
        delete pet.dataset.bubbleEdge;
        delete pet.dataset.bubbleTop;
      }, ms);
    }
    function play(cls) {
      anim.classList.remove('hop', 'squish');
      void anim.offsetWidth;
      anim.classList.add(cls);
      pet.dataset.fx = cls;
    }
    anim.addEventListener('animationend', e => {
      if (e.target === anim) { anim.classList.remove('hop', 'squish'); delete pet.dataset.fx; }
    });

    function burst(x, y, chars, n) {
      if (reduce) n = Math.min(n, 1);
      for (let i = 0; i < n; i++) {
        const el = document.createElement('span');
        const c = pick(chars);
        el.className = 'fx';
        el.textContent = c;
        el.style.left = (x - 8) + 'px';
        el.style.top = (y - 8) + 'px';
        el.style.setProperty('--c', c === '♥' ? '#FF6B8B' : (c === '💢' || c === '⚡' || c === '!' || c === '😾' ? '#FF3B69' : '#F5B83D'));
        el.style.setProperty('--dx', rand(-40, 40) + 'px');
        el.style.setProperty('--dy', rand(-72, -26) + 'px');
        el.style.setProperty('--r', rand(-30, 30) + 'deg');
        el.addEventListener('animationend', () => el.remove());
        root.appendChild(el);
        if (reduce) setTimeout(() => el.remove(), 600);
      }
    }

    function wake() {
      if (isParked) return;
      asleep = false; wakeAcc = 0;
      startleUntil = now() + 700; play('hop'); say(pick(['!', 'hm?', 'mrrp?']), 900);
    }
    function activity(canWake = true) {
      lastActive = now();
      if (canWake && asleep && !isParked) wake();
    }
    const happy = ms => { happyUntil = now() + ms; };
    function startSwat(side) {
      swatUntil = now() + 480; pet.dataset.side = side;
    }
    function pat() {
      activity();
      play('squish');
      burst(P.x, P.y - 36 * S, ['♥'], 3);
      happy(1800);
      const t = now();
      pokes = pokes.filter(p => t - p < 2000); pokes.push(t);
      if (pokes.length >= 5) { pokes = []; startZoomies(); }
      else say(pick(['prrr', 'mrrr', 'mmm', 'purr purr']), 1200);
    }
    function startZoomies() {
      zoomies = { until: now() + 3400 }; asleep = false; forced = null; pounce = null;
      say('zoomies!', 1500);
    }

    /* ---------- hover ---------- */
    const HOVER_SEL = CONFIG.hoverSelector;
    function setHover(el) {
      if (isParked || el === hoverEl) return;
      hoverEl = el; hoverSince = now();
      clearTimeout(hoverTimer);
      hoverTimer = setTimeout(() => {
        if (isParked || hoverEl !== el) return;
        say(el.dataset.pet || (el.tagName === 'A' ? 'ooh, a link' : el.tagName === 'BUTTON' ? 'press it!' : 'hm?'), 1700);
      }, 220);
    }
    function clearHover() { hoverEl = null; clearTimeout(hoverTimer); }
    document.addEventListener('pointerover', e => {
      if (e.pointerType === 'touch' || hidden || isParked) return;
      const el = e.target.closest && e.target.closest(HOVER_SEL);
      if (el && !host.contains(el)) setHover(el);
    }, { signal });
    document.addEventListener('pointerout', e => {
      if (hoverEl && !hoverEl.contains(e.relatedTarget)) clearHover();
    }, { signal });
    document.addEventListener('focusin', e => { const el = e.target.closest && e.target.closest(HOVER_SEL); if (el) setHover(el); }, { signal });
    document.addEventListener('focusout', clearHover, { signal });

    /* ---------- pointer / page events ---------- */
    document.addEventListener('pointermove', e => {
      const t = now();
      M.x = e.clientX; M.y = e.clientY; away = false;
      // cursor speed (px per ms), smoothed
      const v = Math.hypot(e.clientX - prevX, e.clientY - prevY) / Math.max(1, t - prevT);
      curSpeed = curSpeed * 0.7 + v * 0.3; prevX = e.clientX; prevY = e.clientY; prevT = t;

      const moved = Math.hypot(e.clientX - lastX, e.clientY - lastY);
      if (moved > 4) {
        lastX = e.clientX;
        lastY = e.clientY;
        wakeAcc = (asleep && !isParked) ? wakeAcc + moved : 0;
        if (!isParked) activity(wakeAcc > 140);
      }

      // a cat on a routine stops what it is doing when the cursor darts around
      if (forced && forced.auto && !isParked && curSpeed > 1.0) forced = null;

      // stalking: a fast cursor close by looks like a toy
      if (!isParked && curSpeed > 1.6 && t > huntCool && !pounce && !held && !asleep && !hidden &&
          Math.hypot(M.x - P.x, M.y - P.y) < 380 && ['idle', 'sit', 'walk', 'curious'].includes(state) && Math.random() < 0.5) {
        huntCool = t + 5000; forced = null;
        pounce = { live: true, start: t + 650, until: t + 2600 };
      }

      // shake detection
      const dx = e.movementX || 0;
      if (!isParked && Math.abs(dx) > 10) { const s = Math.sign(dx); if (lastSign && s !== lastSign) reversals.push(t); lastSign = s; }
      reversals = reversals.filter(r => t - r < 1000);
      if (!isParked && reversals.length >= 6 && t > dizzyUntil) {
        reversals = []; dizzyUntil = t + 2600; pounce = null; roam = null; zoomies = null; say('whoa…', 1800);
      }
    }, { signal });
    document.addEventListener('pointerdown', e => {
      if (e.pointerType === 'touch') { M.x = e.clientX; M.y = e.clientY; }
    }, { signal });
    document.documentElement.addEventListener('mouseleave', () => { away = true; clearHover(); }, { signal });
    document.documentElement.addEventListener('mouseenter', () => { away = false; }, { signal });

    document.addEventListener('click', e => {
      if (hidden || isPet(e) || isParked) return;
      activity();
      const interactive = e.target.closest && e.target.closest('a,button,input,textarea,select,label,summary,[role=button]');
      burst(e.clientX, e.clientY, ['✦'], 3);
      if (interactive) { happy(900); play('hop'); return; }
      const t = now();
      if (Math.random() < 0.25) {
        // cats do not come when called
        aloofUntil = t + 5000; roam = null; pounce = null;
        forced = { s: 'sit', until: t + 3000, auto: true };
        say(pick(['meh.', '...', 'not now.']), 1600);
      } else {
        pounce = { x: e.clientX, y: e.clientY - 16, start: t + 600, until: t + 2600 };
        if (Math.random() < 0.35) say(pick(['*wiggle*', 'got it', '*sniff*']), 1000);
      }
    }, { signal });

    addEventListener('scroll', () => {
      const ds = scrollY - lastScroll; lastScroll = scrollY;
      const t = now();
      if (isParked && !held && !drag) {
        if (!isCaseStudyPage()) {
          if (Math.abs(ds) > 1.5 && t - lastScrollReaction > 700) {
            lastScrollReaction = t;
            asleep = false;
            scheduleParkSleep(2400, true);
          }
        }
        return;
      }
      activity();
    }, { passive: true, signal });
    addEventListener('resize', () => {
      W = innerWidth; H = innerHeight;
      if (isParked) {
        if (isCaseStudyPage()) {
          const { minX, maxX } = getTOCBounds();
          P.x = clamp(P.x, minX, maxX);
          P.y = H - BOTTOM;
        } else if (parkedAtEmail) {
          const pos = getEmailPosition();
          P.x = pos.x;
          P.y = pos.y;
        } else {
          P.x = clamp(P.x, HX + 8, W - HX - 8);
          P.y = clamp(P.y, HY + 4, H - BOTTOM);
        }
      }
    }, { signal });

    let lastKnownPath = typeof window !== 'undefined' ? window.location.pathname : '';
    function checkRouteChange() {
      const cur = window.location.pathname;
      if (cur !== lastKnownPath) {
        lastKnownPath = cur;
        if (isParked) {
          if (isCaseStudyPage()) {
            parkAtLeft();
          } else {
            parkAtEmail();
          }
        }
      }
    }
    window.addEventListener('popstate', checkRouteChange, { signal });

    /* ---------- drag / pat / hover / tail touch / parking ---------- */
    function wakeUpAndFollow() {
      if (!isParked && !asleep) return;
      clearTimeout(parkSleepTimer);
      isParked = false;
      parkedSide = null;
      parkedAtEmail = false;
      delete pet.dataset.parked;
      justDropped = false;
      asleep = false;
      forced = null;
      roam = null;
      pounce = null;
      zoomies = null;
      wakeAcc = 0;
      aloofUntil = 0;
      lastActive = now();
      play('hop');
      burst(P.x, P.y - 36 * S, ['♥', '✦'], 4);
      happy(2000);
      say(pick(['mrrp! 🐾', "let's go!", '*stretch*', 'purrr']), 1500);
    }

    function checkHoverWake() {
      if (isParked && !held && !drag) {
        if (!justDropped || now() - parkedAt > 600) {
          if (!isCaseStudyPage()) {
            wakeUpAndFollow();
          } else {
            happy(1500);
            patrolPauseUntil = Math.max(patrolPauseUntil, now() + 1400);
          }
        }
      }
    }
    pet.addEventListener('pointerenter', e => {
      if (e.pointerType === 'touch') return;
      checkHoverWake();
    });
    pet.addEventListener('pointerover', e => {
      if (e.pointerType === 'touch') return;
      checkHoverWake();
    });
    pet.addEventListener('pointerleave', () => {
      justDropped = false;
    });

    function angryTailReaction() {
      isParked = false;
      parkedSide = null;
      delete pet.dataset.parked;
      justDropped = false;
      activity(false);
      asleep = false;
      forced = null;
      zoomies = null;
      pounce = null;
      roam = null;
      held = false;
      pet.classList.remove('held');

      swatUntil = now() + 520;
      annoyedUntil = now() + 3000;
      aloofUntil = now() + 5500;

      pet.dataset.side = 'r';
      play('hop');

      const angrySayings = [
        'HISSS! 😾',
        "DON'T TOUCH MY TAIL!",
        'HISSS! 💢',
        '*angry hiss* 😾',
        'HEY! NOT THE TAIL!',
        'GRRR! 😾',
        'RUDE! 💢'
      ];
      say(pick(angrySayings), 1800);

      burst(P.x + 18 * S, P.y - 20 * S, ['💢', '⚡', '😾', '!'], 5);

      // Flinch & recoil away to the left (away from tail)
      P.vx = -10;
      P.vy = -7;
    }

    pet.addEventListener('pointerdown', e => {
      const path = e.composedPath ? e.composedPath() : [];
      const isTail = path.some(el => el.classList && el.classList.contains('tail')) ||
                     (e.target && e.target.closest && e.target.closest('.tail'));
      if (isTail) {
        e.preventDefault();
        e.stopPropagation();
        angryTailReaction();
        return;
      }
      e.preventDefault();
      pet.setPointerCapture(e.pointerId);
      drag = { sx: e.clientX, sy: e.clientY, ox: P.x - e.clientX, oy: P.y - e.clientY, moved: false, vx: 0, vy: 0, lx: e.clientX, ly: e.clientY, lt: now() };
    });
    pet.addEventListener('pointermove', e => {
      if (!drag) {
        if (e.pointerType !== 'touch') checkHoverWake();
        return;
      }
      if (!drag.moved && Math.hypot(e.clientX - drag.sx, e.clientY - drag.sy) > 6) {
        drag.moved = true; held = true; pet.classList.add('held'); pounce = null; roam = null; forced = null; zoomies = null;
        if (isParked) {
          isParked = false;
          parkedSide = null;
          delete pet.dataset.parked;
          justDropped = false;
          asleep = false;
        }
        activity();
      }
      if (drag.moved) {
        const t = now(), dt = Math.max(1, t - drag.lt) / 16.67;
        drag.vx += (((e.clientX - drag.lx) / dt) - drag.vx) * 0.5;
        drag.vy += (((e.clientY - drag.ly) / dt) - drag.vy) * 0.5;
        drag.lx = e.clientX; drag.ly = e.clientY; drag.lt = t;
        P.x = clamp(e.clientX + drag.ox, HX, W - HX);
        P.y = clamp(e.clientY + drag.oy, HY + 4, H - BOTTOM);
        P.vx = drag.vx; P.vy = 0;
      }
    });
    function release(cancel) {
      if (!drag) return;
      const d = drag; drag = null;
      if (d.moved) {
        held = false; pet.classList.remove('held');
        isParked = true;
        parkedAtEmail = false;
        parkedAt = now();
        justDropped = true;
        P.x = clamp(P.x, HX + 8, W - HX - 8);
        P.y = clamp(P.y, HY + 4, H - BOTTOM);
        P.vx = 0;
        P.vy = 0;
        asleep = false;
        forced = { s: 'sit', until: now() + 600, auto: true, then: 'sleep' };
        play('squish');
        say(pick(['*curls up*', 'zzz', '*naps*', 'staying here~', 'chill spot...']), 1600);
        scheduleParkSleep(2600);
        return;
      } else if (!cancel) {
        if (isParked) {
          wakeUpAndFollow();
        } else {
          pat();
        }
      }
    }
    pet.addEventListener('pointerup', () => release(false));
    pet.addEventListener('pointercancel', () => release(true));
    pet.addEventListener('dblclick', () => { startSwat(M.x < P.x ? 'l' : 'r'); say('*bap*', 900); });

    /* ---------- treats ---------- */
    function throwBerry() {
      const x = rand(100, Math.max(110, W - 100)), y = rand(130, Math.max(140, H - 130));
      const el = document.createElement('span');
      el.className = 'berry'; el.style.left = x + 'px'; el.style.top = y + 'px';
      root.appendChild(el);
      treats.push({ x, y, el });
      activity(); pounce = null; roam = null; forced = null; aloofUntil = 0;
      say('berry!!', 1200);
    }
    function eat(tr) {
      tr.el.remove(); treats = treats.filter(t => t !== tr);
      burst(tr.x, tr.y, ['♥', '✦'], 4); play('hop'); eatUntil = now() + 1300; say('nom nom', 1200);
    }

    /* ---------- reaction preview chips ---------- */
    function trigger(name) {
      const t = now();
      lastActive = t; asleep = false; pounce = null; roam = null; zoomies = null; forced = null; aloofUntil = t + 1500;
      const far = () => {
        const dir = P.x < W / 2 ? 1 : -1;
        return { x: clamp(P.x + dir * Math.min(360, W * 0.45), 70, W - 70), y: clamp(P.y + rand(-60, 60), HY + 10, H - 60), until: t + 4000 };
      };
      switch (name) {
        case 'walk': roam = { ...far(), k: 0.0022 }; break;
        case 'run': roam = { ...far(), k: 0.012 }; break;
        case 'zoomies': startZoomies(); break;
        case 'sit': forced = { s: 'sit', until: t + 3200 }; break;
        case 'groom': forced = { s: 'groom', until: t + 2800 }; break;
        case 'stretch': forced = { s: 'stretch', until: t + 2000 }; break;
        case 'yawn': forced = { s: 'yawn', until: t + 1400 }; break;
        case 'sleep': forced = { s: 'sleep', until: t + 3400 }; say('zzz', 1200); break;
        case 'curious': forced = { s: 'curious', until: t + 2600 }; break;
        case 'rub': forced = { s: 'rub', until: t + 2600 }; break;
        case 'startle': startleUntil = t + 900; play('hop'); say('!', 800); break;
        case 'stalk': pounce = { live: true, start: t + 900, until: t + 2800 }; break;
        case 'swat': startSwat(Math.random() < 0.5 ? 'l' : 'r'); say('*bap*', 900); break;
        case 'purr': happyUntil = t + 2200; burst(P.x, P.y - 36 * S, ['♥'], 4); break;
        case 'eat': eatUntil = t + 1500; say('nom nom', 1300); break;
        case 'annoyed': annoyedUntil = t + 1800; say('mrrp.', 1400); break;
        case 'dizzy': dizzyUntil = t + 2600; say('whoa…', 1800); break;
        case 'held': forced = { s: 'held', until: t + 2200 }; say('put me down!', 1500); break;
      }
    }

    /* ---------- hide toggle ---------- */
    function setHidden(h) {
      hidden = h; host.style.display = h ? 'none' : '';
      if (!h) { P.x = M.x; P.y = clamp(M.y + 90, HY + 4, H - BOTTOM); P.vx = P.vy = 0; say('back!', 1000); }
    }
    addEventListener('keydown', e => {
      if (CONFIG.hotkey && e.key.toLowerCase() === String(CONFIG.hotkey).toLowerCase() && !e.metaKey && !e.ctrlKey && !e.altKey && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !document.activeElement.isContentEditable) setHidden(!hidden);
    }, { signal });

    /* ---------- ambient life ---------- */
    (function blinkLoop() {
      if (destroyed) return;
      if (!hidden && !asleep && state !== 'dizzy') {
        // a slow blink is how a cat says it likes you
        const slow = (state === 'idle' || state === 'sit') && Math.hypot(M.x - P.x, M.y - P.y) < 400 && Math.random() < 0.3;
        const cls = slow ? 'slow' : 'blink';
        eyesOpen.classList.remove('blink', 'slow'); void eyesOpen.getBoundingClientRect();
        eyesOpen.classList.add(cls);
        setTimeout(() => eyesOpen.classList.remove(cls), slow ? 1150 : 170);
      }
      setTimeout(blinkLoop, rand(2500, 6000));
    })();
    (function fidgetLoop() {
      if (destroyed) return;
      if (!hidden && (state === 'idle' || state === 'sit')) {
        const el = pick([...ears, nose]);
        const cls = el === nose ? 'sniff' : 'twitch';
        el.classList.remove(cls); void el.getBoundingClientRect(); el.classList.add(cls);
        setTimeout(() => el.classList.remove(cls), 500);
      }
      setTimeout(fidgetLoop, rand(3000, 7000));
    })();

    /* ---------- main loop ---------- */
    function tick(t) {
      if (destroyed) return;
      rafId = requestAnimationFrame(tick);
      const dt = Math.min(2, (t - last) / 16.67 || 1); last = t;
      if (hidden) return;

      // resolve any scripted action
      let f = null;
      if (forced) {
        if (t < forced.until) f = forced.s;
        else { const th = forced.then; forced = null; if (th === 'sleep') { asleep = true; say('zzz', 1200); } }
      }
      const frozen = isParked || asleep || t < dizzyUntil || t < eatUntil || t < swatUntil ||
        (pounce && t < pounce.start) || (f && STILL.has(f));

      // 1. choose a target, lowest to highest priority
      let tx = P.x, ty = P.y, k = 0.0065, lookAt = M;
      if (!isParked) {
        const dx = P.x - M.x, dy = P.y - M.y, d = Math.hypot(dx, dy);
        if (d > FOLLOW && t > aloofUntil) { tx = M.x + dx / d * FOLLOW; ty = M.y + dy / d * FOLLOW; }
        if (hoverEl) {
          const r = hoverEl.getBoundingClientRect();
          if (r.bottom < 0 || r.top > H) clearHover();
          else {
            hoverBig = r.width > 260;
            if (hoverBig) { tx = r.left + 60; ty = r.top - 4; }
            else if (r.left > 90) { tx = r.left - 36 * S; ty = r.top + r.height / 2; }
            else { tx = r.right + 36 * S; ty = r.top + r.height / 2; }
            k = 0.008; lookAt = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
          }
        }
        if (away) { tx = W - 60; ty = H - 50; k = 0.008; lookAt = { x: P.x + Math.sin(t * 0.002) * 100, y: P.y }; }
        if (zoomies) {
          if (t > zoomies.until) { zoomies = null; aloofUntil = t + 3000; say('*pant*', 1200); }
          else if (!roam) roam = { x: rand(70, W - 70), y: rand(90, H - 70), k: 0.015, until: t + 1500 };
        }
        if (roam) {
          if (t > roam.until || Math.hypot(roam.x - P.x, roam.y - P.y) < 24) roam = null;
          else { tx = roam.x; ty = roam.y; k = roam.k; lookAt = roam; }
        }
        const tr = treats[0];
        if (tr) {
          tx = tr.x; ty = tr.y; k = 0.012; lookAt = tr;
          if (Math.hypot(tr.x - P.x, tr.y - P.y) < 28 && t >= eatUntil) eat(tr);
        }
        if (pounce) {
          if (t > pounce.until) pounce = null;
          else if (t >= pounce.start) {
            if (pounce.live && !pounce.set) { pounce.x = M.x; pounce.y = M.y - 16; pounce.set = true; }
            if (!pounce.jumped) { pounce.jumped = true; play('hop'); }
            tx = pounce.x; ty = pounce.y; k = 0.014; lookAt = pounce;
            if (Math.hypot(pounce.x - P.x, pounce.y - P.y) < 28) {
              startSwat(pounce.x < P.x ? 'l' : 'r'); burst(P.x, P.y - 28, ['✦'], 3); pounce = null;
            }
          } else lookAt = pounce.live ? M : pounce;
        }
      }
      const inCaseStudyPatrol = isCaseStudyPage() && isParked && !held && !drag && t > dizzyUntil && t > eatUntil && t > swatUntil;

      if (frozen && !inCaseStudyPatrol) { tx = P.x; ty = P.y; }

      // 2. spring physics
      if (held) { P.vx *= 0.9; }
      else if (inCaseStudyPatrol) {
        P.y = H - BOTTOM;
        P.vy = 0;
        const { minX, maxX } = getTOCBounds();

        if (t < patrolPauseUntil) {
          P.vx = 0;
          lookAt = { x: P.x + patrolDir * 80, y: P.y };
        } else {
          const walkSpeed = 1.9;
          P.vx = patrolDir * walkSpeed;
          P.x += P.vx * dt;
          lookAt = { x: P.x + patrolDir * 120, y: P.y };

          if (patrolDir === 1 && P.x >= maxX) {
            P.x = maxX;
            P.vx = 0;
            patrolDir = -1;
            patrolPauseUntil = t + rand(1500, 2400);
          } else if (patrolDir === -1 && P.x <= minX) {
            P.x = minX;
            P.vx = 0;
            patrolDir = 1;
            patrolPauseUntil = t + rand(1500, 2400);
          }
        }
      }
      else if (isParked) {
        P.vx = 0; P.vy = 0;
      }
      else {
        P.vx += (tx - P.x) * k * dt; P.vy += (ty - P.y) * k * dt;
        const damp = Math.pow(0.84, dt);
        P.vx *= damp; P.vy *= damp;
        const s = Math.hypot(P.vx, P.vy);
        if (s > MAXV) { P.vx *= MAXV / s; P.vy *= MAXV / s; }
        P.x += P.vx * dt; P.y += P.vy * dt;
        if (P.x < HX) { P.x = HX; P.vx = Math.abs(P.vx) * 0.6; }
        if (P.x > W - HX) { P.x = W - HX; P.vx = -Math.abs(P.vx) * 0.6; }
        if (P.y < HY + 4) { P.y = HY + 4; P.vy = Math.abs(P.vy) * 0.6; }
        if (P.y > H - BOTTOM) { P.y = H - BOTTOM; P.vy = -Math.abs(P.vy) * 0.6; }
      }
      const sp = Math.hypot(P.vx, P.vy);

      // 3. cat routines: groom, stretch, wander, then a yawn before a nap
      if (walkFlag ? sp < 0.6 : sp > 1.2) walkFlag = !walkFlag;
      if (runFlag ? sp < 5.5 : sp > 7) runFlag = !runFlag;
      if (!walkFlag) runFlag = false;
      if (sp > 0.5) stillSince = t;
      const free = !isParked && !f && !held && !asleep && !hoverEl && !treats.length && !pounce && !roam && !zoomies &&
        t > happyUntil && t > eatUntil && t > swatUntil && t > annoyedUntil && t > dizzyUntil && t > startleUntil && sp < 0.5;
      if (free && t - lastActive > SLEEP_AFTER) {
        forced = { s: 'yawn', until: t + 1400, auto: true, then: 'sleep' }; say('*yawn*', 1300);
      } else if (free && t > nextAct && (state === 'idle' || state === 'sit')) {
        nextAct = t + rand(5000, 11000);
        const act = pick(['groom', 'groom', 'stretch', 'wander', 'wander']);
        if (act === 'groom') { forced = { s: 'groom', until: t + 2600, auto: true }; aloofUntil = t + 3200; }
        else if (act === 'stretch') { forced = { s: 'stretch', until: t + 1900, auto: true }; aloofUntil = t + 2500; }
        else {
          roam = { x: clamp(P.x + rand(-170, 170), HX + 10, W - HX - 10), y: clamp(P.y + rand(-90, 90), HY + 10, H - 50), k: 0.0022, until: t + 3500 };
          aloofUntil = t + 5000;
        }
      }

      // 4. state machine
      const hv = hoverEl && sp < 1.5;
      const s =
        held ? 'held' :
        f ? f :
        t < dizzyUntil ? 'dizzy' :
        t < eatUntil ? 'eat' :
        t < swatUntil ? 'swat' :
        t < annoyedUntil ? 'annoyed' :
        t < startleUntil ? 'startle' :
        t < happyUntil ? 'happy' :
        (pounce && t < pounce.start) ? 'crouch' :
        (asleep && !inCaseStudyPatrol) ? 'sleep' :
        inCaseStudyPatrol ? (walkFlag ? 'walk' : (t - stillSince > 2200 ? 'sit' : 'idle')) :
        isParked ? 'sit' :
        hv ? (hoverBig ? 'sit' : (t - hoverSince > 1100 ? 'rub' : 'curious')) :
        runFlag ? 'run' :
        walkFlag ? 'walk' :
        (t - stillSince > 2500) ? 'sit' : 'idle';
      if (s !== state) { state = s; pet.dataset.state = s; }
      if (s === 'rub' && t > rubHeart) { burst(P.x, P.y - 36 * S, ['♥'], 1); rubHeart = t + 1200; }

      // 5. look direction (drives eye / nose / whisker parallax)
      let lx = lookAt.x - P.x, ly = lookAt.y - P.y;
      if (s === 'sleep' || s === 'dizzy' || s === 'groom') { lx = 0; ly = 0; }
      const ld = Math.hypot(lx, ly) || 1, mag = Math.min(ld / 80, 1);
      lookX += (lx / ld * mag - lookX) * 0.18; lookY += (ly / ld * mag - lookY) * 0.18;
      pet.style.setProperty('--lx', lookX.toFixed(3));
      pet.style.setProperty('--ly', lookY.toFixed(3));

      // 6. whole-body squash, stretch, lean (limbs are animated in CSS)
      let sx = 1, sy = 1, rot = 0;
      if (!reduce) {
        sx = 1 + Math.min(Math.abs(P.vx) * 0.012, 0.15) - Math.min(Math.abs(P.vy) * 0.008, 0.08);
        sy = 1 - Math.min(Math.abs(P.vx) * 0.009, 0.1) + Math.min(Math.abs(P.vy) * 0.01, 0.1);
        rot = clamp(P.vx * 0.9, -12, 12);
      }
      tilt.style.transform = `rotate(${rot.toFixed(2)}deg) scale(${sx.toFixed(3)},${sy.toFixed(3)})`;
      pet.style.transform = `translate3d(${(P.x - HX).toFixed(1)}px,${(P.y - HY).toFixed(1)}px,0) scale(${S})`;
    }
    rafId = requestAnimationFrame(tick);
    if (CONFIG.greeting) setTimeout(() => say(CONFIG.greeting, 1800), 700);

    // Initial parked sleep: after 3.5 seconds starting by email, curls up and sleeps
    if (!isCaseStudyPage()) {
      scheduleParkSleep(3500);
    }

    // If email element renders slightly after load (due to loaderDelay), keep polling until found
    if (parkedAtEmail && isParked) {
      let emailPollCount = 0;
      const emailPoll = setInterval(() => {
        emailPollCount++;
        if (!isParked || !parkedAtEmail || emailPollCount > 35) {
          clearInterval(emailPoll);
          return;
        }
        const pos = getEmailPosition();
        P.x = pos.x;
        P.y = pos.y;
        if (pos.found) {
          clearInterval(emailPoll);
        }
      }, 150);
    }

    function destroy() {
      destroyed = true;
      if (rafId) cancelAnimationFrame(rafId);
      if (abortController) abortController.abort();
      if (host && host.parentNode) {
        host.parentNode.removeChild(host);
      }
      delete window.SitePet;
    }

    // ---- public API: window.SitePet ----
    window.SitePet = {
      trigger,                       // 'walk' 'run' 'zoomies' 'sit' 'groom' 'stretch' 'yawn' 'sleep' 'curious'
                                     // 'rub' 'startle' 'stalk' 'swat' 'purr' 'eat' 'annoyed' 'dizzy' 'held'
      angry: angryTailReaction,
      wake: wakeUpAndFollow,
      park: (x = 'right', y) => {
        isParked = true;
        parkedAt = now();
        justDropped = true;
        if (typeof x === 'number') {
          P.x = clamp(x, HX + 8, W - HX - 8);
          P.y = typeof y === 'number' ? clamp(y, HY + 4, H - BOTTOM) : H - BOTTOM;
          delete pet.dataset.parked;
        } else if (x === 'left') {
          parkAtLeft();
          return;
        } else if (x === 'email') {
          parkAtEmail();
          return;
        } else {
          parkedSide = 'right';
          parkedAtEmail = false;
          pet.dataset.parked = 'right';
          P.x = W - HX - 16;
          P.y = H - BOTTOM;
        }
        P.vx = 0; P.vy = 0;
        asleep = true;
        forced = null;
        play('squish');
        say(pick(['*curls up*', 'zzz']), 1500);
      },
      berry: throwBerry,             // drops a berry for the cat to chase and eat
      say: (text, ms) => say(String(text), ms),
      hide: () => setHidden(true),
      show: () => setHidden(false),
      toggle: () => setHidden(!hidden),
      destroy
    };
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
