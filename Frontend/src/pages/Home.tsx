import React from "react";
import { Link } from "react-router-dom";

// Responsive styles
const responsiveFont = {
    fontSize: "clamp(1.8rem, 5vw, 2.3rem)",
    margin: "1rem 0 0.5rem",
    fontWeight: 700,
};

const responsiveDesc = {
    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
    color: "#e0e0e0",
};

const Home: React.FC = () => {

    return (
        <div className="homepage-container"
            style={{
                minHeight: "100vh",
                backgroundColor: "ghostwhite",
                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' version='1.1' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:svgjs='http://svgjs.dev/svgjs' width='1440' height='560' preserveAspectRatio='none' viewBox='0 0 1440 560'%3e%3cg mask='url(%26quot%3b%23SvgjsMask1344%26quot%3b)' fill='none'%3e%3cuse xlink:href='%23SvgjsSymbol1351' x='0' y='0'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsSymbol1351' x='720' y='0'%3e%3c/use%3e%3c/g%3e%3cdefs%3e%3cmask id='SvgjsMask1344'%3e%3crect width='1440' height='560' fill='white'%3e%3c/rect%3e%3c/mask%3e%3cpath d='M-1 0 a1 1 0 1 0 2 0 a1 1 0 1 0 -2 0z' id='SvgjsPath1350'%3e%3c/path%3e%3cpath d='M-3 0 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0z' id='SvgjsPath1345'%3e%3c/path%3e%3cpath d='M-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0z' id='SvgjsPath1347'%3e%3c/path%3e%3cpath d='M2 -2 L-2 2z' id='SvgjsPath1346'%3e%3c/path%3e%3cpath d='M6 -6 L-6 6z' id='SvgjsPath1348'%3e%3c/path%3e%3cpath d='M30 -30 L-30 30z' id='SvgjsPath1349'%3e%3c/path%3e%3c/defs%3e%3csymbol id='SvgjsSymbol1351'%3e%3cuse xlink:href='%23SvgjsPath1345' x='30' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='30' y='90' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='30' y='150' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='30' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='30' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='30' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='30' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='30' y='450' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='30' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='30' y='570' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='90' y='30' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='90' y='90' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1349' x='90' y='150' stroke='rgba(38%2c 102%2c 220%2c 1)' stroke-width='3'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='90' y='210' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='90' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='90' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='90' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='90' y='450' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='90' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1349' x='90' y='570' stroke='rgba(5%2c 53%2c 142%2c 1)' stroke-width='3'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='150' y='30' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='150' y='90' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='150' y='150' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='150' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='150' y='270' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='150' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='150' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='150' y='450' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='150' y='510' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='150' y='570' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='210' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='210' y='90' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='210' y='150' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='210' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='210' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='210' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='210' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='210' y='450' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='210' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='210' y='570' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='270' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='270' y='90' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='270' y='150' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='270' y='210' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='270' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='270' y='330' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='270' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='270' y='450' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='270' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='270' y='570' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='330' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='330' y='90' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='330' y='150' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='330' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='330' y='270' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='330' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='330' y='390' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='330' y='450' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='330' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='330' y='570' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='390' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='390' y='90' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='390' y='150' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='390' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='390' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='390' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='390' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='390' y='450' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='390' y='510' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='390' y='570' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='450' y='30' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='450' y='90' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='450' y='150' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='450' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='450' y='270' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='450' y='330' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='450' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='450' y='450' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='450' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='450' y='570' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='510' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='510' y='90' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='510' y='150' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='510' y='210' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='510' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1349' x='510' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)' stroke-width='3'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='510' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='510' y='450' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='510' y='510' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='510' y='570' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='570' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='570' y='90' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='570' y='150' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='570' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='570' y='270' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='570' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='570' y='390' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1349' x='570' y='450' stroke='rgba(5%2c 53%2c 142%2c 1)' stroke-width='3'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='570' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='570' y='570' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='630' y='30' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='630' y='90' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='630' y='150' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='630' y='210' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='630' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1346' x='630' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='630' y='390' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='630' y='450' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='630' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='630' y='570' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='690' y='30' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='690' y='90' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='690' y='150' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='690' y='210' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1345' x='690' y='270' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1349' x='690' y='330' stroke='rgba(5%2c 53%2c 142%2c 1)' stroke-width='3'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1347' x='690' y='390' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1349' x='690' y='450' stroke='rgba(38%2c 102%2c 220%2c 1)' stroke-width='3'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1350' x='690' y='510' stroke='rgba(38%2c 102%2c 220%2c 1)'%3e%3c/use%3e%3cuse xlink:href='%23SvgjsPath1348' x='690' y='570' stroke='rgba(5%2c 53%2c 142%2c 1)'%3e%3c/use%3e%3c/symbol%3e%3c/svg%3e")`,
                objectFit: "cover",
                objectPosition: "center",
                width: "100%",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                color: "#222",
                fontFamily: "Segoe UI, sans-serif",
                padding: "0 1rem",
                // backdropFilter: "blur(0.5px)",
            }}
        >
            <div className="homepage-header" style={{ display: "flex", width: "90%", padding: "1rem", marginTop: ".5rem", alignItems: "center", gap: "1.1rem", }}>
                <img
                    src="../src/assets/android-chrome-512x512 (2).png"
                    className="home-logo"
                    alt="VidTube Logo"
                    width={65}
                    height={56}
                    style={{
                        // width: "60px",
                        // height: "50px",
                        borderRadius: "20%",
                        padding: "5px",
                        backgroundColor: "#ghostwhite",
                        objectFit: "cover",
                    }}
                />
                <h1 style={{
                    ...responsiveFont,
                    color: "#222",
                    margin: 0,
                    fontFamily: "Tsukimi Rounded , sans-serif",
                    fontWeight: 600,
                }}>WATCHNEST</h1>
            </div>
            {/* Top Section: Logo, Title, Description, Button, Image */}
            <div
                className="max-[850px]:mt-[1.3rem]"
                style={{
                    display: "flex",
                    width: "80%",
                    maxWidth: "1100px",
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "1.3rem",
                    marginBottom: "3rem",
                    flexWrap: "wrap",
                }}
            >
                {/* Left: Logo, Title, Description, Button */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "flex-start",
                        minWidth: 0,
                        flex: "1 1 320px",
                        maxWidth: "500px",
                        gap: "0.7rem",
                    }}
                >
                    {/* Description */}
                    <p style={{
                        fontSize: "clamp(1.5rem, 3vw, 2.4rem)",
                        color: "rgb(71 71 71)",
                        margin: "0.5rem 0px 0.7rem",
                        fontWeight: 400,
                        backgroundColor: "#f8f8ffa6",
                    }}>
                        Upload, Stream, and Share Your Favorite Videos Instantly!
                    </p>
                    {/* Get Started Button */}
                    <Link
                        to="/login"
                        style={{
                            background: "#fff",
                            color: "#2a5298",
                            padding: "0.7rem 1.5rem",
                            borderRadius: "1.5rem",
                            fontWeight: 500,
                            fontSize: "clamp(1rem, 2vw, 1.1rem)",
                            textDecoration: "none",
                            boxShadow: "0 2px 12px rgba(30,60,114,0.08)",
                            transition: "background 0.2s, color 0.2s, transform 0.18s",
                            display: "inline-flex",
                            gap: "0.4rem",
                            letterSpacing: "0.02em",
                            cursor: "pointer",
                            outline: "none",
                            border: "1px solid #e0e0e0",
                            alignItems: "flex-end",
                            marginTop: "0.5rem",
                        }}
                        onMouseOver={e => {
                            e.currentTarget.style.background = "#f0f4ff";
                            e.currentTarget.style.color = "#1e3c72";
                            e.currentTarget.style.transform = "translateY(-3px) scale(1.04)";
                        }}
                        onMouseOut={e => {
                            e.currentTarget.style.background = "#fff";
                            e.currentTarget.style.color = "#2a5298";
                            e.currentTarget.style.transform = "none";
                        }}
                    >
                        Get Started
                        <svg
                            width="22"
                            height="22"
                            fill="none"
                            viewBox="0 0 24 24"
                            style={{
                                animation: "bounce-right 1s infinite alternate",
                                display: "inline-block",
                            }}
                        >
                            <circle cx="12" cy="12" r="11" fill="#2a5298" opacity="0.10" />
                            <path
                                d="M10 8l4 4-4 4"
                                stroke="#2a5298"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <style>
                            {`
                                @keyframes bounce-right {
                                    0% { transform: translateX(0); }
                                    100% { transform: translateX(6px); }
                                }
                            `}
                        </style>
                    </Link>
                </div>
                {/* Right: Illustration/Image */}
                <div
                    style={{
                        flex: "1 1 320px",
                        minWidth: "260px",
                        maxWidth: "420px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginTop: "0.5rem",
                    }}
                >
                    <img
                        src="../src/assets/home-page.png"
                        alt="Video Streaming Illustration"
                        style={{
                            width: "100%",
                            maxWidth: "370px",
                            borderRadius: "1.2rem",
                            objectFit: "cover",
                        }}
                    />
                </div>
            </div>

            {/* Features Section */}
            <div className="homepage-features"
                style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                    gap: "1.5rem",
                    width: "100%",
                    maxWidth: "85%",
                    marginBottom: "2.5rem",
                }}
            >
                <Feature
                    icon={
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                            <rect x="3" y="5" width="18" height="14" rx="2" fill="#2a5298" opacity="1" />
                            <polygon points="10,9 16,12 10,15" fill="#fff" />
                        </svg>
                    }
                    title="Stream Instantly"
                    desc="Watch videos in HD with no buffering."
                />
                <Feature
                    icon={
                        <svg width="40" height="40" fill="none" viewBox="0 0 24 24">
                            <path d="M12 3v18M5 12h14" stroke="#2a5298" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                    }
                    title="Upload Easily"
                    desc="Share your moments with a simple upload."
                />
                <Feature
                    icon={
                        <svg width="40" height="40" fill="#2a5298" viewBox="0 0 24 24">
                            <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" fill="#2a5298" opacity="1" />
                        </svg>
                    }
                    title="Share Anywhere"
                    desc="Send videos to friends and family."
                />
                <Feature
                    icon={
                        <svg width="40" height="40" fill="#2a5298" viewBox="0 0 24 24">
                            <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" fill="#2a5298" opacity="1" />
                        </svg>
                    }
                    title="Share Anywhere"
                    desc="Send videos to friends and family."
                />
                <Feature
                    icon={
                        <svg width="40" height="40" fill="#2a5298" viewBox="0 0 24 24">
                            <path d="M17 10.5V7a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3.5l4 4v-11l-4 4z" fill="#2a5298" opacity="1" />
                        </svg>
                    }
                    title="Share Anywhere"
                    desc="Send videos to friends and family."
                />
            </div>
            <style>
                {`
                    @media (max-width: 400px) {
                        .homepage-header {
                            width: 100% !important;
                          padding: .5rem !important;
                        }
                        .home-features {
                            max-width: 95% !important;
                        }
                    }
                `}</style>
        </div >
    );
};

const Feature: React.FC<{
    icon: React.ReactNode;
    title: string;
    desc: string;
}> = ({
    icon,
    title,
    desc,
}: {
    icon: React.ReactNode;
    title: string;
    desc: string;
}) => (
        <div
            style={{
                background: "rgba(255,255,255,1)",
                borderRadius: "1rem",
                padding: "1.2rem 1.5rem",
                minWidth: 0,
                textAlign: "center",
                boxShadow: "0 3px 10px rgba(30,60,114,0.35)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100%",
                transition: "all 0.2s",
            }}
        >
            <div style={{ marginBottom: "0.5rem" }}>{icon}</div>
            <div
                style={{
                    fontWeight: 600,
                    fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                    marginBottom: "0.3rem",
                }}
            >
                {title}
            </div>
            <div style={{ fontSize: "clamp(0.88rem, 2vw, 1rem)", color: "black", marginBottom: ".3rem" }}>{desc}</div>
        </div>
    );

export default Home;
