import { useState, useEffect, useRef } from "react";
import { LOGO } from "./shared";

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{background:#F5F7FF;color:#1A1F3C;font-family:'Montserrat',sans-serif;font-size:16px;line-height:1.7;overflow-x:hidden}
  .lm-nav{position:fixed;top:0;left:0;right:0;z-index:100;display:flex;align-items:center;justify-content:space-between;padding:1rem 5%;background:rgba(255,255,255,0.95);backdrop-filter:blur(20px);border-bottom:1px solid rgba(26,58,107,0.15);box-shadow:0 1px 20px rgba(26,58,107,0.06)}
  .lm-nav-links{display:flex;gap:2rem;list-style:none;align-items:center}
  .lm-nav-links a{color:#5B6380;text-decoration:none;font-size:.88rem;font-weight:500;transition:color .25s}
  .lm-nav-links a:hover{color:#1A3A6B}
  .lm-nav-cta{background:#1A3A6B!important;color:#fff!important;padding:.5rem 1.3rem;border-radius:50px;font-weight:700!important;font-size:.82rem!important}
  .lm-nav-cta:hover{background:#0F2A55!important}
  .lm-nav-dropdown{position:relative}
  .lm-nav-dropdown-toggle{color:#5B6380;text-decoration:none;font-size:.88rem;font-weight:500;transition:color .25s;display:flex;align-items:center;gap:.35rem;cursor:pointer;background:none;border:none;font-family:'Montserrat',sans-serif;padding:0}
  .lm-nav-dropdown-toggle:hover{color:#1A3A6B}
  .lm-nav-dropdown-toggle svg{transition:transform .2s}
  .lm-nav-dropdown.open .lm-nav-dropdown-toggle svg{transform:rotate(180deg)}
  .lm-nav-dropdown-menu{position:absolute;top:calc(100% + .8rem);left:50%;transform:translateX(-50%);background:#fff;border:1px solid rgba(26,58,107,.15);border-radius:12px;box-shadow:0 8px 32px rgba(26,58,107,.12);min-width:160px;overflow:hidden;opacity:0;pointer-events:none;transform:translateX(-50%) translateY(-6px);transition:opacity .2s,transform .2s}
  .lm-nav-dropdown.open .lm-nav-dropdown-menu{opacity:1;pointer-events:auto;transform:translateX(-50%) translateY(0)}
  .lm-nav-dropdown-item{display:block;padding:.75rem 1.2rem;color:#1A1F3C;text-decoration:none;font-size:.85rem;font-weight:500;transition:background .2s,color .2s;white-space:nowrap}
  .lm-nav-dropdown-item:hover{background:rgba(26,58,107,.06);color:#1A3A6B}
  .lm-hero{min-height:100vh;display:flex;flex-direction:column;justify-content:center;padding:8rem 5% 4rem;position:relative;overflow:hidden;background:#F5F7FF}
  .lm-hero-grid{position:absolute;inset:0;background-image:linear-gradient(rgba(26,58,107,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(26,58,107,.07) 1px,transparent 1px);background-size:60px 60px;-webkit-mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%);mask-image:radial-gradient(ellipse 80% 80% at 50% 50%,black 20%,transparent 100%)}
  .lm-orb{position:absolute;border-radius:50%;filter:blur(100px);pointer-events:none}
  .lm-orb1{width:600px;height:600px;background:radial-gradient(circle,rgba(26,58,107,.12),transparent 70%);top:-100px;right:-100px}
  .lm-orb2{width:400px;height:400px;background:radial-gradient(circle,rgba(49,69,109,.12),transparent 70%);bottom:-50px;left:20%}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
  .lm-badge{display:inline-flex;align-items:center;gap:.5rem;background:rgba(26,58,107,.08);border:1px solid rgba(26,58,107,.25);border-radius:50px;padding:.4rem 1rem;font-size:.78rem;color:#1A3A6B;font-weight:600;letter-spacing:.05em;text-transform:uppercase;margin-bottom:2rem;width:fit-content;animation:fadeUp .8s ease both}
  .lm-badge-dot{width:8px;height:8px;background:#1A3A6B;border-radius:50%;animation:pulse 2s infinite;flex-shrink:0}
  .lm-h1{font-size:clamp(2.8rem,6vw,5.5rem);font-weight:800;line-height:1.05;letter-spacing:-2px;max-width:750px;animation:fadeUp .8s .1s ease both}
  .lm-h1{width:100vw;margin-left:calc(50% - 50vw);max-width:none;padding:0 5%;}
  .lm-highlight{background:linear-gradient(135deg,#1A3A6B,#31456D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text}
  .lm-hero-desc{max-width:600px;margin-top:1.5rem;color:#5B6380;font-size:1.05rem;font-weight:300;animation:fadeUp .8s .2s ease both}
  .lm-hero-desc{width:100vw;margin-left:calc(50% - 50vw);max-width:none;padding:0 5%;}
  .lm-hero-actions{display:flex;gap:1rem;margin-top:2.5rem;flex-wrap:wrap;animation:fadeUp .8s .3s ease both}
  .lm-btn-primary{background:linear-gradient(135deg,#1A3A6B,#0F2A55);color:#fff;font-family:'Montserrat',sans-serif;font-weight:700;font-size:.95rem;padding:.85rem 2rem;border:none;border-radius:50px;cursor:pointer;text-decoration:none;display:inline-block;transition:transform .2s,box-shadow .2s;box-shadow:0 4px 20px rgba(26,58,107,.3)}
  .lm-btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(26,58,107,.4)}
  .lm-btn-outline{background:transparent;color:#1A3A6B;font-family:'Montserrat',sans-serif;font-weight:600;font-size:.95rem;padding:.85rem 2rem;border:1.5px solid rgba(26,58,107,.35);border-radius:50px;cursor:pointer;text-decoration:none;display:inline-block;transition:border-color .2s,background .2s}
  .lm-btn-outline:hover{border-color:#1A3A6B;background:rgba(26,58,107,.06)}
  .lm-stats{display:flex;gap:3rem;margin-top:4rem;padding-top:3rem;border-top:1px solid rgba(26,58,107,.15);flex-wrap:wrap;animation:fadeUp .8s .4s ease both}
  .lm-stat-num{font-size:2rem;font-weight:800;color:#1A3A6B}
  .lm-stat-label{font-size:.82rem;color:#5B6380;margin-top:.2rem}
  .lm-divider{height:1px;background:linear-gradient(90deg,transparent,rgba(26,58,107,.15),transparent);margin:0 5%}
  .lm-section{padding:6rem 5%;position:relative;z-index:1}
  .lm-section-tag{font-size:.78rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#1A3A6B;margin-bottom:1rem;display:flex;align-items:center;gap:.5rem;width:100vw;margin-left:calc(50% - 50vw);max-width:none;padding:0 5%;}
  .lm-section-tag::before{content:"";width:24px;height:2px;background:#1A3A6B}
  .lm-section-title{font-size:clamp(1.8rem,3.5vw,3rem);font-weight:800;line-height:1.15;letter-spacing:-1px;max-width:700px}
  .lm-section-title{width:100vw;margin-left:calc(50% - 50vw);max-width:none;padding:0 5%;}
  .lm-section-sub{color:#5B6380;max-width:560px;margin-top:1rem;font-size:1rem}
  .lm-section-sub{width:100vw;margin-left:calc(50% - 50vw);max-width:none;padding:0 5%;}
  .lm-div-grid{display:grid;grid-template-columns:1fr 1fr;gap:2px;margin-top:3rem;border:1px solid rgba(26,58,107,.15);border-radius:16px;overflow:hidden}
  
  .lm-div-card{padding:3rem;background:rgba(26,58,107,.04);position:relative;transition:background .3s}
  .lm-div-card:hover{background:rgba(26,58,107,.08)}
  .lm-div-card-left{border-right:1px solid rgba(26,58,107,.15)}
  .lm-div-number{font-size:5rem;font-weight:800;color:rgba(26,58,107,.06);position:absolute;top:1rem;right:2rem;line-height:1}
  .lm-div-icon{width:52px;height:52px;background:linear-gradient(135deg,rgba(26,58,107,.15),rgba(49,69,109,.1));border:1px solid rgba(26,58,107,.15);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:1.5rem;margin-bottom:1.5rem}
  .lm-div-h3{font-size:1.5rem;font-weight:800;margin-bottom:.75rem}
  .lm-div-p{color:#5B6380;font-size:.95rem;margin-bottom:1.5rem}
  .lm-tag-row{display:flex;flex-wrap:wrap;gap:.5rem}
  .lm-tag{background:rgba(26,58,107,.08);border:1px solid rgba(26,58,107,.2);color:#1A3A6B;font-size:.75rem;font-weight:600;padding:.3rem .8rem;border-radius:50px}
  .lm-tag-violet{background:rgba(49,69,109,.08);border:1px solid rgba(49,69,109,.25);color:#31456D;font-size:.75rem;font-weight:600;padding:.3rem .8rem;border-radius:50px}
  .lm-services-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5px;background:rgba(26,58,107,.15);border:1px solid rgba(26,58,107,.15);border-radius:16px;overflow:hidden;margin-top:3rem}
  .lm-service-card{background:#fff;padding:2rem 2rem 2.5rem;transition:background .3s}
  .lm-service-card:hover{background:rgba(26,58,107,.03)}
  .lm-service-icon{font-size:1.8rem;margin-bottom:1rem;display:block}
  .lm-service-num{font-size:.72rem;color:#1A3A6B;font-weight:700;letter-spacing:.1em;margin-bottom:1.2rem}
  .lm-service-num-v{font-size:.72rem;color:#31456D;font-weight:700;letter-spacing:.1em;margin-bottom:1.2rem}
  .lm-service-h4{font-size:1.05rem;font-weight:700;margin-bottom:.7rem}
  .lm-service-p{color:#5B6380;font-size:.88rem;line-height:1.65}
  .lm-tech-content{display:grid;grid-template-columns:1fr;gap:4rem;align-items:center;margin-top:3rem}
  .lm-tech-h3{font-size:1.7rem;font-weight:800;margin-bottom:1rem;width:100vw;margin-left:calc(50% - 50vw);max-width:none;padding:0 5%;}
  .lm-tech-p{color:#5B6380;margin-bottom:2rem;font-size:.95rem;width:100vw;margin-left:calc(50% - 50vw);max-width:none;padding:0 5%;}
  .lm-tech-list{display:flex;flex-direction:column;gap:.8rem}
  .lm-tech-item{display:flex;align-items:flex-start;gap:1rem;padding:1rem 1.2rem;background:rgba(26,58,107,.04);border:1px solid rgba(26,58,107,.15);border-radius:12px;transition:all .25s}
  .lm-tech-item:hover{border-color:rgba(26,58,107,.4);background:rgba(26,58,107,.06)}
  .lm-tech-item-icon{font-size:1.2rem;flex-shrink:0;margin-top:.1rem}
  .lm-tech-item-strong{display:block;font-size:.9rem;font-weight:700;margin-bottom:.2rem}
  .lm-tech-item-span{font-size:.82rem;color:#5B6380}
  .lm-tech-right{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
  .lm-metric-card{background:rgba(26,58,107,.04);border:1px solid rgba(26,58,107,.15);border-radius:14px;padding:1.5rem;text-align:center;transition:transform .2s}
  .lm-metric-card:hover{transform:translateY(-3px)}
  .lm-metric-full{grid-column:1/-1}
  .lm-metric-num{font-size:3rem;font-weight:800;background:linear-gradient(135deg,#1A3A6B,#31456D);-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;line-height:1}
  .lm-metric-label{font-size:.82rem;color:#5B6380;margin-top:.5rem}
  .lm-diff-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3rem}
  .lm-diff-card{background:rgba(26,58,107,.04);border:1px solid rgba(26,58,107,.15);border-radius:16px;padding:2rem;transition:transform .25s,border-color .25s}
  .lm-diff-card:hover{transform:translateY(-4px);border-color:rgba(26,58,107,.35)}
  .lm-diff-icon{width:44px;height:44px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:1.3rem;margin-bottom:1.2rem;background:linear-gradient(135deg,rgba(26,58,107,.12),rgba(49,69,109,.08));border:1px solid rgba(26,58,107,.15)}
  .lm-diff-h4{font-size:1rem;font-weight:700;margin-bottom:.6rem}
  .lm-diff-p{color:#5B6380;font-size:.85rem;line-height:1.6}
  .lm-portfolio-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;margin-top:3rem}
  /* Carousel styles: horizontal scroll + scroll-snap */
  .lm-portfolio-carousel{margin-top:3rem;position:relative}
  .lm-portfolio-track{display:flex;gap:1rem;overflow-x:auto;padding-bottom:8px;padding-left:1rem;padding-right:1rem;scroll-snap-type:x mandatory;-webkit-overflow-scrolling:touch}
  .lm-portfolio-track::-webkit-scrollbar{height:8px}
  .lm-portfolio-track::-webkit-scrollbar-thumb{background:rgba(26,58,107,.12);border-radius:8px}
  /* show 3 items per view on desktop by calculating available width minus gaps */
  .lm-portfolio-item{flex:0 0 calc((100% - 2rem) / 3);min-width:200px;max-width:420px;scroll-snap-align:center}
  @media(max-width:1100px){.lm-portfolio-item{flex:0 0 calc((100% - 1rem) / 2);min-width:260px}}
  @media(max-width:700px){.lm-portfolio-item{flex:0 0 86%;min-width:86%}}
  .lm-portfolio-prev,.lm-portfolio-next{position:absolute;top:50%;transform:translateY(-50%);width:48px;height:48px;border-radius:999px;border:none;background:linear-gradient(135deg,#1A3A6B,#31456D);color:#fff;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(26,58,107,.18);cursor:pointer;z-index:20}
  .lm-portfolio-prev{left:-24px}
  .lm-portfolio-next{right:-24px}
  .lm-portfolio-prev:hover,.lm-portfolio-next:hover{transform:translateY(-50%) scale(1.03)}
  @media(max-width:700px){.lm-portfolio-prev,.lm-portfolio-next{display:none}}
  .lm-portfolio-dot{width:10px;height:10px;border-radius:999px;background:rgba(26,58,107,.12);border:none;cursor:pointer}
  .lm-portfolio-dot.active{background:linear-gradient(135deg,#1A3A6B,#31456D)}
  .lm-portfolio-item{background:rgba(26,58,107,.04);border:1px solid rgba(26,58,107,.15);border-radius:12px;padding:1.5rem;transition:all .25s}
  .lm-portfolio-item:hover{border-color:rgba(26,58,107,.4);transform:translateY(-3px)}
  .lm-portfolio-dot{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,#1A3A6B,#31456D);margin-bottom:1rem;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;color:#fff}
  .lm-portfolio-thumb{max-width:48px;height:auto;border-radius:8px;object-fit:cover;margin-bottom:1rem;flex-shrink:0;border:1px solid rgba(26,58,107,.08)}
  .lm-portfolio-h5{font-size:.9rem;font-weight:700;line-height:1.3}
  .lm-portfolio-p{font-size:.78rem;color:#5B6380;margin-top:.4rem}
  .lm-process-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5px;background:rgba(26,58,107,.15);border:1px solid rgba(26,58,107,.15);border-radius:16px;overflow:hidden;margin-top:3rem}
  .lm-step{background:#fff;padding:2.5rem 2rem;position:relative;transition:background .25s}
  .lm-step:hover{background:rgba(26,58,107,.03)}
  .lm-step-num{font-size:3rem;font-weight:800;color:rgba(26,58,107,.07);position:absolute;top:.5rem;right:1rem}
  .lm-step-h4{font-size:1rem;font-weight:700;margin-top:3rem;margin-bottom:.6rem}
  .lm-step-p{color:#5B6380;font-size:.85rem;line-height:1.6}
  .lm-cta-section{background:linear-gradient(135deg,#EEF2FB 0%,#E8EEFF 50%,#F0ECFF 100%);padding:7rem 5%;text-align:center;position:relative;overflow:hidden;border-top:1px solid rgba(26,58,107,.15);border-bottom:1px solid rgba(26,58,107,.15)}
  .lm-cta-section::before{content:"";position:absolute;width:800px;height:400px;background:radial-gradient(ellipse,rgba(26,58,107,.08) 0%,transparent 70%);top:50%;left:50%;transform:translate(-50%,-50%)}
  .lm-cta-h2{font-size:clamp(2rem,4vw,3.5rem);font-weight:800;letter-spacing:-1.5px;max-width:700px;margin:0 auto 1.5rem;position:relative;z-index:1}
  .lm-cta-p{color:#5B6380;font-size:1rem;max-width:700px;margin:0 auto 2.5rem;position:relative;z-index:1}
  .lm-cta-actions{display:flex;gap:1rem;justify-content:center;flex-wrap:wrap;position:relative;z-index:1}
  .lm-contact-row{display:flex;justify-content:center;gap:2.5rem;margin-top:3rem;flex-wrap:wrap;position:relative;z-index:1}
  .lm-contact-item{display:flex;align-items:center;gap:.6rem;font-size:.9rem;color:#5B6380}
  .lm-contact-label{color:#1A3A6B;font-weight:600}
  .lm-ideation-box{margin-top:3rem;padding-top:2rem;border-top:1px solid rgba(26,58,107,.15);position:relative;z-index:1}
  .lm-ideation-title{color:#1A3A6B;font-weight:700;font-size:1rem;margin-bottom:.5rem}
  .lm-ideation-sub{color:#5B6380;font-size:.88rem;max-width:500px;margin:0 auto}
  .lm-footer{background:#fff;border-top:1px solid rgba(26,58,107,.15);padding:2.5rem 5%;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem}
  .lm-footer-p{color:#5B6380;font-size:.8rem}
  .lm-footer-links{display:flex;gap:1.5rem;list-style:none}
  .lm-footer-links a{color:#5B6380;text-decoration:none;font-size:.82rem;transition:color .2s}
  .lm-footer-links a:hover{color:#1A3A6B}
  .lm-mission-box{background:linear-gradient(135deg,rgba(26,58,107,.06),rgba(49,69,109,.04));border:1px solid rgba(26,58,107,.18);border-radius:20px;padding:2.5rem;position:relative;overflow:hidden;margin-top:3rem}
  .lm-mission-box::before{content:"";position:absolute;top:-60px;right:-60px;width:200px;height:200px;background:radial-gradient(circle,rgba(26,58,107,.1),transparent 70%);pointer-events:none}
  .lm-mission-label{font-size:.72rem;font-weight:700;letter-spacing:.15em;text-transform:uppercase;color:#1A3A6B;margin-bottom:1.2rem;display:flex;align-items:center;gap:.5rem}
  .lm-mission-label::before{content:"";width:20px;height:2px;background:#1A3A6B;flex-shrink:0}
  .lm-mission-h3{font-size:1.45rem;font-weight:800;line-height:1.25;margin-bottom:1.2rem;letter-spacing:-.5px}
  .lm-mission-p{color:#5B6380;font-size:.95rem;line-height:1.8}
  .lm-values-section{margin-top:2.5rem}
  .lm-values-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:1.2rem;margin-top:1.5rem}
  .lm-value-card{display:flex;flex-direction:column;gap:.8rem;padding:1.6rem;background:#fff;border:1px solid rgba(26,58,107,.13);border-radius:14px;transition:all .25s;cursor:default}
  .lm-value-card:hover{border-color:rgba(26,58,107,.35);background:rgba(26,58,107,.02);transform:translateY(-4px);box-shadow:0 8px 24px rgba(26,58,107,.08)}
  .lm-value-num{width:36px;height:36px;background:linear-gradient(135deg,#1A3A6B,#31456D);border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:.75rem;font-weight:800;color:#fff;flex-shrink:0}
  .lm-value-h4{font-size:.92rem;font-weight:700;margin-bottom:.3rem}
  .lm-value-p{color:#5B6380;font-size:.82rem;line-height:1.65}
  @media(max-width:1100px){.lm-values-grid{grid-template-columns:repeat(3,1fr)}}
  @media(max-width:700px){.lm-values-grid{grid-template-columns:1fr 1fr}}
  @media(max-width:480px){.lm-values-grid{grid-template-columns:1fr}}
  .lm-reveal{opacity:0;transform:translateY(30px);transition:opacity .7s ease,transform .7s ease}
  .lm-visible{opacity:1!important;transform:translateY(0)!important}
  @media(max-width:900px){.lm-div-grid,.lm-tech-content{grid-template-columns:1fr}.lm-div-card-left{border-right:none;border-bottom:1px solid rgba(26,58,107,.15)}.lm-services-grid,.lm-diff-grid{grid-template-columns:1fr 1fr}.lm-portfolio-grid{grid-template-columns:1fr 1fr}.lm-process-grid{grid-template-columns:1fr 1fr}.lm-nav-links{display:none}.lm-tech-right{grid-template-columns:1fr 1fr}}
  @media(max-width:600px){.lm-services-grid,.lm-diff-grid,.lm-portfolio-grid,.lm-process-grid{grid-template-columns:1fr}}
  .lm-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 999;
  }

  .lm-modal {
    background: #fff;
    padding: 20px;
    border-radius: 12px;
    width: 90%;
    max-width: 400px;
    position: relative;
  }

  .lm-close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    background: none;
    font-size: 18px;
    cursor: pointer;
  }

  .lm-contact-form {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 10px;
  }

  .lm-contact-form input,
  .lm-contact-form textarea {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #ccc;
  }
  .lm-form-status {
    font-size: .88rem;
    padding: .6rem 1rem;
    border-radius: 8px;
    text-align: center;
  }
  .lm-form-status.success {
    background: #e6f4ea;
    color: #1e7e34;
    border: 1px solid #b2dfbd;
  }
  .lm-form-status.error {
    background: #fdecea;
    color: #c0392b;
    border: 1px solid #f5b5ae;
  }
`;

export default function HomePage() {
  const revealRefs = useRef([]);
  const [servicesOpen, setServicesOpen] = useState(false);

  const addRef = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  useEffect(() => {
    const styleEl = document.createElement("style");
    styleEl.textContent = CSS;
    document.head.appendChild(styleEl);

    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("lm-visible"); }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach(el => el && obs.observe(el));
    const handleClickOutside = () => setServicesOpen(false);
    document.addEventListener("click", handleClickOutside);
    return () => { obs.disconnect(); document.head.removeChild(styleEl); document.removeEventListener("click", handleClickOutside); };
  }, []);

  return (
    <div id="lm-root" style={{ fontFamily: "'Montserrat', sans-serif" }}>
      {/* NAV */}
      <nav className="lm-nav">
        <a href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <img src={LOGO} alt="La-MORKS Technologies" style={{ height: "72px", width: "auto", objectFit: "contain" }} />
        </a>
        <ul className="lm-nav-links">
          <li className={`lm-nav-dropdown${servicesOpen ? " open" : ""}`}>
            <button className="lm-nav-dropdown-toggle" onClick={(e) => { e.stopPropagation(); setServicesOpen(o => !o); }}>
              Services
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 4l4 4 4-4" stroke="#5B6380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <div className="lm-nav-dropdown-menu">
              <a href="/technology" className="lm-nav-dropdown-item" onClick={() => setServicesOpen(false)}>Technology</a>
              <a href="/animation" className="lm-nav-dropdown-item" onClick={() => setServicesOpen(false)}>Animation</a>
            </div>
          </li>
          <li><a href="mailto:info@la-morks.com" className="lm-nav-cta">Get In Touch</a></li>
        </ul>
      </nav>

      {/* HERO */}
      <section className="lm-hero">
        <div className="lm-hero-grid" />
        <div className="lm-orb lm-orb1" />
        <div className="lm-orb lm-orb2" />
        <div className="lm-badge"><span className="lm-badge-dot" />Founded 2024 · UK-Based · AI-First</div>
        <h1 className="lm-h1">Where <span className="lm-highlight">Creative Vision</span><br />Meets Technical Excellence</h1>
        <p className="lm-hero-desc">La‑MORKS Technologies is a UK-based technology and animation powerhouse delivering AI-accelerated product development, end-to-end animation production, and digital transformation services.</p>
        {/* <div className="lm-hero-actions">
          <a href="mailto:info@la-morks.com" className="lm-btn-primary">Contact us to Start a Project</a>
        </div> */}
        {/* <div className="lm-mission-box" ref={addRef}>
          <div className="lm-div-icon">💻</div>
          <h3 className="lm-div-h3">Technology Division</h3>
          <p className="lm-div-p">AI-accelerated product development, full-stack engineering, and digital transformation consultancy for organisations across the UK and Ireland.</p>
          <div className="lm-tag-row">{["Full-Stack Dev","AI/ML","Digital Health","Cloud","Data Analytics"].map(t => <span key={t} className="lm-tag">{t}</span>)}</div>
        </div> 
        <div className="lm-stats">
          {[["10×","Faster to Market"],["50%","AI Production Speedup"],["2","Specialist Divisions"],["12+","Projects Delivered"]].map(([n,l]) => (
            <div key={l}><div className="lm-stat-num">{n}</div><div className="lm-stat-label">{l}</div></div>
          ))}
        </div> */}
      </section>

      {/* DIVISIONS */}
      <section className="lm-section" style={{ background: "#fff" }}>
        <div className="lm-section-tag">Our Divisions</div>
        <h2 className="lm-section-title">Two Specialised Divisions, One Unified Vision</h2>
        <p className="lm-section-sub">Delivering excellence across technology product development and creative animation — powered by AI.</p>
        <div className="lm-div-grid" ref={addRef}>
          <a href="/technology" className="lm-div-card lm-div-card-left" style={{ textDecoration: "none", color: "inherit", display: "block", cursor: "pointer" }}>
            <div className="lm-div-number">01</div>
            <div className="lm-div-icon">💻</div>
            <h3 className="lm-div-h3">Technology Division</h3>
            <p className="lm-div-p">AI-accelerated product development, full-stack engineering, and digital transformation consultancy for organisations across the UK and Ireland.</p>
            <div className="lm-tag-row">{["Full-Stack Dev","AI/ML","Digital Health","Cloud","Data Analytics"].map(t => <span key={t} className="lm-tag">{t}</span>)}</div>
          </a>
          <a href="/animation" className="lm-div-card" style={{ textDecoration: "none", color: "inherit", display: "block", cursor: "pointer" }}>
            <div className="lm-div-number">02</div>
            <div className="lm-div-icon">🎬</div>
            <h3 className="lm-div-h3">Animation Division</h3>
            <p className="lm-div-p">End-to-end creative production — from concept and storyboarding to final delivery. Cinematic content at speed, powered by cutting-edge AI tools.</p>
            <div className="lm-tag-row">{["2D / 3D Animation","Motion Graphics","VFX","AI Production"].map(t => <span key={t} className="lm-tag-violet">{t}</span>)}</div>
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="lm-cta-section" id="contact">
        <h2 className="lm-cta-h2">Let's Create Something <span className="lm-highlight">Extraordinary</span></h2>
        <p className="lm-cta-p">Whether you're launching a product, expanding your existing product, or looking for supporting and managing regular changes — we're here to turn your ideas into reality.</p>
        <div className="lm-cta-actions">
          <a href="mailto:info@la-morks.com" className="lm-btn-primary">📧 Email Us</a>
        </div>
        <div className="lm-contact-row">
          {[["Email","info@la-morks.com"],["Tel / WhatsApp","+353 87 908 2590"],["HQ","United Kingdom"]].map(([label,val]) => (
            <div key={label} className="lm-contact-item"><span className="lm-contact-label">{label}:</span><span>{val}</span></div>
          ))}
        </div>
        <div className="lm-ideation-box">
          <p className="lm-ideation-title">🎁 Free IDEAtion Session</p>
          <p className="lm-ideation-sub">Includes a complimentary Project &amp; Market Feasibility Report — no obligation.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="lm-footer">
        <img src={LOGO} alt="La-MORKS Technologies" style={{ height: "56px", width: "auto", objectFit: "contain" }} />
        <p className="lm-footer-p">© 2024 La-MORKS Technologies Pvt Ltd. All rights reserved.</p>
        <ul className="lm-footer-links">
          {[["#about","About"],["/technology","Technology"],["#portfolio","Portfolio"],["mailto:info@la-morks.com","Contact"]].map(([href,label]) => (
            <li key={label}><a href={href}>{label}</a></li>
          ))}
        </ul>
      </footer>
    </div>
  );
}
