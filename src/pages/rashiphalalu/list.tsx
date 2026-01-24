import { useNavigate, useParams } from "react-router-dom";


const RASIS = [
"మేషం","వృషభం","మిథునం","కర్కాటకం","సింహం","కన్య",
"తుల","వృశ్చికం","ధనుస్సు","మకరం","కుంభం","మీనం"
];


export default function RashiList() {
const navigate = useNavigate();
const { type } = useParams();


return (
<div className="min-h-screen bg-gradient-to-br from-orange-50 to-white pb-24">
<div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-4 font-bold">
{type} రాశి ఫలాలు
</div>


<div className="grid grid-cols-3 gap-4 p-4">
{RASIS.map(r=> (
<div
key={r}
onClick={()=>navigate(`/rashiphalalu/${type}/${r}`)}
className="bg-white rounded-xl shadow-md p-4 text-center font-bold cursor-pointer"
>
{r}
</div>
))}
</div>
</div>
);
}