import { doc } from 'firebase/firestore';
import L from 'leaflet'
import { auth } from './db/auth';
import { getDishes } from './db/dishes';
import { getAllEventHalls } from './db/event_hall';
import { EventHall } from '../types';
import { createBooking } from './db/booking';
import { db } from './db/firebase';
import { User } from 'firebase/auth';
import { createMessage } from './chat/ai';
import { CoreMessage } from 'ai';

const menu_btn = document.querySelectorAll("#menu") as NodeListOf<HTMLDivElement>;
const about_btn = document.querySelectorAll("#about") as NodeListOf<HTMLDivElement>
const booking_btn = document.querySelectorAll("#booking") as NodeListOf<HTMLDivElement>
const close_btn = document.querySelectorAll("#close") as NodeListOf<HTMLDivElement>;
const menu_card = document.querySelector("#card-menu") as HTMLDivElement
const about_card = document.querySelector("#card-about") as HTMLDivElement
const booking_card = document.querySelector("#card-booking") as HTMLDivElement
const userElement = document.querySelector("#user") as HTMLDivElement
const menu_card_back = document.querySelectorAll('.menu-card-back') as NodeListOf<HTMLDivElement>;
const cotizacion_card = document.getElementById('cotizacion') as HTMLDivElement
let halls : Array<EventHall> = []
let currentUser : User | null;
const map = L.map('map').setView([51.505, -0.09], 13);

menu_btn.forEach(btn=>btn.addEventListener("click",(e)=>{
    e.preventDefault();
    about_card.classList.remove("show")
    menu_card.classList.toggle("show")
    booking_card.classList.remove("show")
}))

about_btn.forEach(btn=>btn.addEventListener("click",(e)=>{
    e.preventDefault();
    menu_card.classList.remove("show")
    about_card.classList.toggle("show")
    booking_card.classList.remove("show")
}))

booking_btn.forEach(btn=>btn.addEventListener("click",(e)=>{
    e.preventDefault()
    booking_card.classList.toggle("show")
    menu_card.classList.remove("show")
    about_card.classList.remove("show")
}))

close_btn.forEach(btn=>btn.addEventListener("click",(e)=>{
    e.preventDefault()
    menu_card.classList.remove("show")
    about_card.classList.remove("show")
    booking_card.classList.remove("show")
}))

menu_card_back.forEach(back=>back.addEventListener("click",(e)=>{
    e.stopPropagation()
    menu_card.classList.remove('show')
    about_card.classList.remove("show")
    booking_card.classList.remove("show")
}))

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19
}).addTo(map);


L.marker([51.5, -0.09]).bindPopup("Nibble Restaurant").addTo(map)


auth.onAuthStateChanged(user=>{
    const userComponent = `<div class="user">
            <img src="/images/avatar.png">
            <button class="btn btn-logout"><img src='/images/logout.svg' /></button>
            </div>`
    userElement.innerHTML = user ? userComponent : "<a href='/login/'>Inicia sesión</a>"
    currentUser = user
    document.querySelector('.btn-logout')?.addEventListener("click",()=>{
        auth.signOut()
    })
})


getDishes().then((data)=>{
    const allDishes = document.querySelector('.all-dishes') as HTMLDivElement
    for(const category of data.keys()){
        allDishes.innerHTML += `<h4>${category}</h4>`
        const arrayDishes = data.get(category)
        arrayDishes?.forEach((dish)=>{
            allDishes.innerHTML += `<div class="dish">
            <div class="dish-name">
                <h5>${dish.nombre}</h5>
                <span>$ ${dish.precio}</span>
            </div>
            <span class="separator"></span>
            <p>${dish.descripcion}</p>
        </div>`
        })
    }
})

getAllEventHalls().then((data)=>{
    const allEventHalls = document.querySelector('.events-hall') as HTMLDivElement
    halls = data
    data.forEach((eventHall)=>{
        allEventHalls.innerHTML += `<div class="event-hall">
        <div class="event-hall-info">
            <h5>${eventHall.nombre}</h5>
            <span class="separator"></span>
            <p>${eventHall.descripcion}</p>
            <img src="${eventHall.image}" alt="${eventHall.nombre}">
            <div class="event-hall-cotizacion">
                <p>Número de personas: ${eventHall.cotizacion[0].num_per}</p>
                <p>Precio estimado: $ ${eventHall.cotizacion[0].precio_estimado}</p>
            </div>
        </div>
    </div>`
    })

    var selectEvent = document.getElementById('hall') as HTMLSelectElement | null;
    var selectPerson= document.getElementById('person') as HTMLSelectElement;

    data.forEach((eventHall)=>{
        var option = document.createElement("option");
        option.text = eventHall.nombre;
        selectEvent?.add(option);
    })

    data[0].cotizacion.forEach((cotizacion)=>{
        var option = document.createElement("option");
        option.text = cotizacion.num_per;
        selectPerson?.add(option);
    })
    cotizacion_card.innerHTML = `<span>${data[0].cotizacion[0].precio_estimado}</span>`
})

var selectHall = document.getElementById('hall') as HTMLSelectElement | null;

selectHall?.addEventListener('change',()=>{
    var selectPerson= document.getElementById('person') as HTMLSelectElement;
    const selectedHall = selectHall?.value
    const hall = halls.find(hall=>hall.nombre === selectedHall);
    selectPerson.innerHTML = ''
    hall?.cotizacion.forEach((cotizacion)=>{
        
        var option = document.createElement("option");
        
        option.text = cotizacion.num_per;
        selectPerson?.add(option);
        cotizacion_card.innerHTML = `<span>${hall.cotizacion[0].precio_estimado}</span>`
    })
})


var selectPerson = document.getElementById('person') as HTMLSelectElement;

selectPerson?.addEventListener('change',()=>{
    const selectedHall = selectHall?.value
    const hall = halls.find(hall=>hall.nombre === selectedHall);
    const selectedPerson = selectPerson.value
    const cotizacion = hall?.cotizacion.find(cotizacion=>cotizacion.num_per === selectedPerson)
    cotizacion_card.innerHTML = `<span>${cotizacion?.precio_estimado}</span>`
})

document.getElementById('booking-form')?.addEventListener('submit',async (e)=>{
    e.preventDefault();
    if(!currentUser?.email) return alert('Debes iniciar sesión para reservar')
    const hall = selectHall?.value
    const person = selectPerson.value
    const date = (document.getElementById('date') as HTMLInputElement).value

    await createBooking({
        correo: auth.currentUser?.email || '',
        cotizacion: cotizacion_card.textContent || '',
        reservacion:{
            fecha: new Date(date),
            personas: person,
            salon: doc(db,'Salones',halls.find(h=>h.nombre === hall)?.id as string)
        }
    })
    alert('Reservación exitosa')
})


document.querySelector('.chat-header')?.addEventListener('click',()=>{
    document.querySelector('.chat')?.classList.toggle('hide')
})


let messagesList : CoreMessage[] = [{role:'assistant',content:'Hola, soy una inteligencia artificial programada para ayudarte en todas tus dudas acerca de este restaurante.'}]

const chat = document.querySelector('.chat-messages') as HTMLDivElement

messagesList.forEach((msg)=>{
    chat.innerHTML = `
    <div class="chat-message ${msg.role}">
        <p>${msg.content}</p>
    </div>`
})

document.querySelector('.chat-form')?.addEventListener('submit',async (e)=>{
    e.preventDefault();
    chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'})
    const prompt = document.getElementById('prompt') as HTMLInputElement
    messagesList.push({role:'user',content:prompt.value})
    chat.innerHTML += `
    <div class="chat-message user">
        <p>${prompt.value}</p>
    </div>`
    const loader = document.createElement('div')
    loader.classList.add('chat-message')
    loader.classList.add('loading')
    loader.innerHTML = '<span></span><span></span><span></span>'
    chat.appendChild(loader)
    const text = await createMessage(messagesList)
    const reader = text.getReader()
    if(!text) return chat.innerHTML += `
    <div class="chat-message assistant">
        <p>Hubo un error en tu peticion.</p>
    </div>`
    const div = document.createElement('div')
    const p = document.createElement('p')
    div.classList.add('assistant')
    div.classList.add('chat-message')
    while (true) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }
        console.log(value);
        p.textContent += value
      }
    if(p.textContent==='') return chat.innerHTML += `
    <div class="chat-message assistant">
        <p>Hubo un error en tu peticion.</p>
    </div>`
    messagesList.push({content:p.textContent as string,role:'assistant'});
    loader.style.display = 'none'
    div.appendChild(p)
    chat.appendChild(div)
    chat.scrollTo({top:chat.scrollHeight,behavior:'smooth'})
})


const textarea = document.querySelector('textarea') as HTMLTextAreaElement 

textarea.addEventListener('input',function(){
    this.style.height = '40px';
    this.style.height = `${this.scrollHeight}px`;
})