const wishes=[
'Chúc nàng một ngày 20/10 thật rạng rỡ. Luôn hạnh phúc, tự tin và được yêu thương theo cách đẹp nhất!',
'Mong nàng có đủ bình yên để mỉm cười, đủ can đảm để theo đuổi ước mơ và đủ yêu thương để thấy mỗi ngày đều đáng nhớ. Chúc mừng 20/10!',
'Gửi mẹ ngàn lời yêu thương. Chúc mẹ luôn khỏe mạnh, an vui và có thật nhiều ngày hạnh phúc. Cảm ơn mẹ vì đã luôn là nơi ấm áp nhất để trở về.',
'Chúc người phụ nữ tuyệt vời của hôm nay luôn giữ được ánh sáng riêng, sống trọn với điều mình yêu và dịu dàng với chính mình. Happy 20/10!',
'Cảm ơn nàng vì đã xuất hiện và làm những ngày bình thường trở nên đặc biệt. Chúc nàng luôn được nâng niu, được lắng nghe và được là chính mình.'
];
const $=s=>document.querySelector(s);let wishIndex=0,formIndex=0;const dialog=$('#wish-dialog'),recipient=$('#recipient'),message=$('#message');
const bouquets=[
{src:'bouquet.svg',name:'Hồng phối',alt:'Bó hoa hồng, hoa đào và hoa cúc với những cành lá xanh mềm mại'},
{src:'bouquet-tulips.svg',name:'Tulip hồng',alt:'Bó hoa tulip hồng dịu dàng, gói trong giấy kraft và nơ hồng'},
{src:'bouquet-sunflowers.svg',name:'Hướng dương',alt:'Bó hoa hướng dương vàng và hoa cúc nhỏ, thắt nơ màu mật ong'},
{src:'bouquet-daisies.svg',name:'Cúc trắng',alt:'Bó hoa cúc trắng thanh nhã với lá xanh và nơ xanh lá'},
{src:'bouquet-lavender.svg',name:'Oải hương',alt:'Bó hoa oải hương tím cùng hoa hồng tím nhạt và nơ tím'},
{src:'bouquet-peonies.svg',name:'Sắc đào',alt:'Bó hoa hồng và hoa màu đào rực rỡ với nơ màu cam đất'}
];
let previousBouquet='',chosenBouquet='';try{previousBouquet=localStorage.getItem('gui-nang:last-bouquet')||'';chosenBouquet=localStorage.getItem('gui-nang:chosen-bouquet')||''}catch{}
let selectedBouquet;
function randomBouquet(exclude){const options=bouquets.filter(bouquet=>bouquet.src!==exclude);return options[Math.floor(Math.random()*options.length)]}
function applyBouquet(bouquet){
selectedBouquet=bouquet;
document.querySelectorAll('.bouquet,.postcard-flowers').forEach(img=>{img.src=bouquet.src;if(img.classList.contains('bouquet'))img.alt=bouquet.alt});
document.querySelectorAll('input[name="bouquet"]').forEach(input=>{input.checked=input.value===bouquet.src});
$('#bouquet-status').textContent='Đang chọn: '+bouquet.name;
try{localStorage.setItem('gui-nang:last-bouquet',bouquet.src)}catch{}
}
applyBouquet(bouquets.find(bouquet=>bouquet.src===chosenBouquet)||randomBouquet(previousBouquet));
document.querySelectorAll('input[name="bouquet"]').forEach(input=>input.addEventListener('change',()=>{
if(!input.checked)return;const bouquet=bouquets.find(item=>item.src===input.value);if(!bouquet)return;
applyBouquet(bouquet);try{localStorage.setItem('gui-nang:chosen-bouquet',bouquet.src)}catch{}
}));
$('#random-bouquet').addEventListener('click',()=>{try{localStorage.removeItem('gui-nang:chosen-bouquet')}catch{}applyBouquet(randomBouquet(selectedBouquet.src))});
function sync(){ $('#preview-name').textContent=recipient.value.trim()||'Nàng thân yêu';$('#preview-message').textContent=message.value;$('#character-count').textContent=message.value.length+' / 260';}
recipient.addEventListener('input',sync);message.addEventListener('input',sync);sync();
function petals(){if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;for(let i=0;i<24;i++){const p=document.createElement('i');p.className='petal';p.style.left=Math.random()*100+'%';p.style.animationDelay=Math.random()*.9+'s';p.style.background=['#d691a0','#edc5ba','#b86679'][i%3];$('#petals').append(p);setTimeout(()=>p.remove(),4700)}}
function openWish(){ $('#dialog-message').textContent=wishes[wishIndex];dialog.showModal();petals();}
$('#open-letter').addEventListener('click',openWish);$('#another-wish').addEventListener('click',()=>{wishIndex=(wishIndex+1)%wishes.length;openWish()});
$('.close-dialog').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close()});
$('#next-wish').addEventListener('click',()=>{wishIndex=(wishIndex+1)%wishes.length;$('#dialog-message').textContent=wishes[wishIndex];petals()});
$('#make-card').addEventListener('click',()=>{dialog.close();$('#tao-thiep').scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});setTimeout(()=>recipient.focus({preventScroll:true}),500)});
$('#suggest-wish').addEventListener('click',()=>{formIndex=(formIndex+1)%wishes.length;message.value=wishes[formIndex];sync()});
let toastTimer;function toast(text){$('#toast').textContent=text;$('#toast').classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').classList.remove('show'),4000)}
function lines(ctx,text,width){const result=[];let current='';for(const word of text.replace(/\s+/g,' ').trim().split(' ')){const next=current+(current?' ':'')+word;if(ctx.measureText(next).width<=width){current=next;continue}if(current){result.push(current);current=''}for(const char of word){if(ctx.measureText(current+char).width>width&&current){result.push(current);current=''}current+=char}}result.push(current);return result}
function fitLines(ctx,text,width,maxFont,minFont,family){for(let size=maxFont;size>=minFont;size--){ctx.font=`italic ${size}px ${family}`;let ls=lines(ctx,text,width);if(ls.length<=6)return {lines:ls,size}}return {lines:lines(ctx,text,width),size:minFont}}
$('#card-form').addEventListener('submit',async e=>{e.preventDefault();const button=$('#download-card'),bouquetForCard=selectedBouquet;button.disabled=true;button.textContent='Đang gói yêu thương…';try{
await document.fonts.ready;const c=document.createElement('canvas');c.width=1080;c.height=1440;const ctx=c.getContext('2d');ctx.fillStyle='#faf4e8';ctx.fillRect(0,0,1080,1440);ctx.strokeStyle='#d5bfae';ctx.lineWidth=2;ctx.strokeRect(32,32,1016,1376);ctx.strokeRect(43,43,994,1354);ctx.textAlign='center';ctx.fillStyle='#572c37';ctx.font='500 19px "Be Vietnam Pro",Arial';ctx.fillText('MỘT CHÚT YÊU THƯƠNG GỬI ĐẾN',540,126);
const name=recipient.value.trim()||'Nàng thân yêu';let nameSize=76;while(nameSize>36){ctx.font=`italic ${nameSize}px "Playfair Display",Georgia`;if(ctx.measureText(name).width<870)break;nameSize--}ctx.fillText(name,540,235);
const img=new Image();img.src=bouquetForCard.src;await img.decode();ctx.drawImage(img,310,250,460,575);ctx.fillStyle='#8d364b';ctx.font='115px "Playfair Display",Georgia';ctx.fillText('20 · 10',540,936);
ctx.fillStyle='#572c37';const fitted=fitLines(ctx,message.value,800,34,24,'"Playfair Display",Georgia');ctx.font=`italic ${fitted.size}px "Playfair Display",Georgia`;fitted.lines.forEach((l,i)=>ctx.fillText(l,540,1020+i*(fitted.size*1.5)));ctx.strokeStyle='#d5bfae';ctx.beginPath();ctx.moveTo(110,1300);ctx.lineTo(970,1300);ctx.stroke();ctx.font='500 18px "Be Vietnam Pro",Arial';ctx.fillText('CHÚC MỪNG NGÀY PHỤ NỮ VIỆT NAM',540,1350);
const blob=await new Promise(resolve=>c.toBlob(resolve,'image/png'));if(!blob)throw new Error('image');const url=URL.createObjectURL(blob);const a=document.createElement('a');a.download='gui-nang-20-10.png';a.href=url;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),10000);toast('Thiệp đã sẵn sàng. Gửi một chút thương đến nàng nhé!');petals();
}catch(error){toast('Chưa tải được thiệp. Bạn thử lại giúp mình nhé.')}finally{button.disabled=false;button.innerHTML='Tải tấm thiệp <span aria-hidden="true">↓</span>'}});
