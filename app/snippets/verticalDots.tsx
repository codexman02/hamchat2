export default function VerticalDots(props:{width?:number,height?:number,color:string}){
    return(
        <svg xmlns="http://www.w3.org/2000/svg" width={props.width} height={props.height} fill="currentColor" className={`${props.color}`} viewBox="0 0 16 16">
        <path d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0"/>
      </svg>
    )
}