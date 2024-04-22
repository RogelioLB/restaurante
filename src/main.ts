import L from 'leaflet'
import { auth, getUser } from './db/auth';
const menu_btn = document.querySelectorAll("#menu") as NodeListOf<HTMLDivElement>;
const about_btn = document.querySelectorAll("#about") as NodeListOf<HTMLDivElement>
const close_btn = document.querySelectorAll("#close") as NodeListOf<HTMLDivElement>;
const menu_card = document.querySelector("#card-menu") as HTMLDivElement
const about_card = document.querySelector("#card-about") as HTMLDivElement
const userElement = document.querySelector("#user") as HTMLDivElement
const menu_card_back = document.querySelectorAll('.menu-card-back') as NodeListOf<HTMLDivElement>;
const map = L.map('map').setView([51.505, -0.09], 13);

console.log('A')

menu_btn.forEach(btn=>btn.addEventListener("click",(e)=>{
    e.preventDefault();
    about_card.classList.remove("show")
    menu_card.classList.toggle("show")
}))

about_btn.forEach(btn=>btn.addEventListener("click",(e)=>{
    e.preventDefault();
    menu_card.classList.remove("show")
    about_card.classList.toggle("show")
}))

close_btn.forEach(btn=>btn.addEventListener("click",(e)=>{
    e.preventDefault()
    menu_card.classList.remove("show")
    about_card.classList.remove("show")
}))

menu_card_back.forEach(back=>back.addEventListener("click",(e)=>{
    e.stopPropagation()
    menu_card.classList.remove('show')
    about_card.classList.remove("show")
}))

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);


L.marker([51.5, -0.09]).bindPopup("Nibble Restaurant").addTo(map)


auth.onAuthStateChanged(user=>{
    userElement.innerHTML = user?.email || "Inicia sesión"
    userElement.addEventListener("click",()=>{
        if(user){
            auth.signOut()
        }else{
            window.location.href = '/login.html'
        }
    })
})