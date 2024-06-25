import { CoreMessage, streamText, tool, generateText, } from "ai"
import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { z } from "zod"
import { Dish, getDishes } from "../db/dishes"
import { getRestaurantInfo } from "../db/restaurant"

const googleai = createGoogleGenerativeAI({
    apiKey: import.meta.env.VITE_GOOGLE_AI_APIKEY,
})

export const createMessage = async (messages: CoreMessage[]) => {
    console.log(messages)
    const options = {
        model: googleai("models/gemini-pro"),
        system: 'Eres un bot que ayuda a la gente con sus preguntas sobre un restaurante llamado Nibble. Puedes darles sugerencias, hacer reservaciones, etc.',
        messages,
        tools: {
            sugerencia: tool({
                description: 'Dar una sugerencia de que pedir en base a todos los platillos del restaurante.',
                parameters: z.object({
                    category: z.ostring().describe('Es el tipo de platillo que se desea tener una sugerencia. Por ejemplo, hamburguesas, sushis, sopas, ensaladas, etc.')
                }),
                execute: async ({ category }) => {
                    const dishes = await getDishes()
                    if (category) {
                        const categoryCapitalize = category.charAt(0).toUpperCase() + category.slice(1)
                        return {
                            platillos: dishes.get(categoryCapitalize)
                        }
                    } else {
                        let allDishes: Dish[] = [];
                        for (const d of dishes.values()) {
                            for (const dish of d) {
                                allDishes.push(dish)
                            }
                        }
                        return {
                            platillos: allDishes
                        }
                    }
                }
            }),
            informacion: tool({
                description: 'Dar información sobre el restaurante. Puede ser la ubicación, la historia, etc.',
                parameters: z.object({
                    type: z.object({
                        category: z.ostring().describe('Es el tipo de información que se quiere saber, por ejemplo ubicacion, historia, dueño, entre otros, decide tu de que trata.'),
                        hasCategory: z.boolean().describe('Indica true o false si hay una categoria de informacion.')
                    }).describe('Es un objeto que contiene el tipo de información que se quiere saber. Indica true o false si hay una categoria de informacion.')
                }),
                execute: async ({type}) => {
                    const info = await getRestaurantInfo()
                    console.log(info)
                    return {info,type}
                }
            })
        }
    }
    const result = await generateText(options)
    const toolResult = result.toolResults[0]
    if (toolResult) {
        switch (toolResult.toolName) {
            case 'sugerencia': {
                let dishes: string = '';
                toolResult.result.platillos?.forEach(dish => {
                    dishes += `${dish.nombre} - $${dish.precio} - ${dish.descripcion} \n`
                })
                const { textStream } = await streamText({
                    model: options.model,
                    system: options.system,
                    prompt:`En base a los siguientes platillos ${dishes}. Me gustaria que me dieras alguna recomendación y el porqué. Solo dame una, la que tu consideres mejor.`
                })
                return textStream
            }
            case 'informacion': {
                const json = toolResult.result

                const { textStream } = await streamText({
                    model:options.model,
                    system:options.system,
                    prompt:`En base al siguiente objeto JSON dame la informacion relevante: ${JSON.stringify(json)} solo dame el texto. Si puedes presentala de forma llamativa, no ocupo titulos, solo texto. Por ejemplo si en el type es 'ubicacion' dame la direccion.`
                })
                return textStream
            }
        }
    }
    else {
        const result = await streamText(options)
        return result.textStream
    }
}
