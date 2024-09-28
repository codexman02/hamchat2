"use client"
import {TransformWrapper,TransformComponent} from "react-zoom-pan-pinch"
export default function Zoom(){
    return(
        <div>
        <h1>Pan Pinch Zoom</h1>
        <TransformWrapper >
            <TransformComponent>
                <img src={`/userData/profiles/choco.jpg`} alt="" />
            </TransformComponent>
        </TransformWrapper>
        </div>
    )
}