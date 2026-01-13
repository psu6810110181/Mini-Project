import { Card } from "antd";

interface MyCardProps {
    name : string;
    level : number;
}

const MyCard = (props : MyCardProps) => {
    console.log("ของในกล่อง", props);

    return (
        <Card style={{ width: 300, margin: '10px', border: '2px solid #ddd' }}>
        {/* 3. เวลาจะใช้ ต้องหยิบออกจากกล่องด้วยจุด (.) */}
        <h2>🐾 ชื่อ: {props.name}</h2>
        <p>ความดุร้าย: {props.level}</p>
        
        {/* ใช้ props มาคำนวณ */}
        {props.level > 5 ? <p style={{color:'red'}}>⚠️ อันตราย!</p> : <p style={{color:'green'}}>✅ น่ารัก</p>}
        </Card>
    );
};
export default MyCard;