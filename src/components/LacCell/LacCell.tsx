import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { getData, setAlertWarning, setData, setDataEmpty, setDataSuccess } from "../../redux/main.slice";
import { useEffect, useState } from "react";
import "./LacCell.css";
import { } from "../../redux/main.slice";
import { Loader } from "../Loader/Loader";
import { useAppDispatch } from "../../redux/hooks";
import exportFromJSON from 'export-from-json';
import { DataLacCell } from "../../types/type";

const exportType = exportFromJSON.types.txt;

export const LacCell = () => {
    const { data, dataSuccess, dataEmpty, alertWarning, loading, error } = useSelector((store: RootState) => store.main)
    const dispatch = useAppDispatch();
    useEffect(() => {
        funcAlert();
    }, [dataSuccess, dataEmpty, alertWarning]);

    const [lac, setLac] = useState<string>('');
    const [cell, setCell] = useState<string>('');

    const funcAlert = () => {
        if (dataEmpty === true) {
            setTimeout(() => {
                dispatch(setDataEmpty(false));
            }, 4000);
        } else if (dataSuccess === true) {
            setTimeout(() => {
                dispatch(setDataSuccess(false));
            }, 4000);
        } else if (alertWarning === true) {
            setTimeout(() => {
                dispatch(setAlertWarning(false));
            }, 3000);
        }
    }

    const sendData = async () => {
        let arrLac = [];
        let arrCell = [];
        let dataNew: DataLacCell;
        if (lac.trim() === "" && cell.trim() === "") {
            dispatch(setAlertWarning(true));
            let tempData = { att: '', det: '' }
            dispatch(setData(tempData))
        } else if (lac.trim() !== "" && cell.trim() === "") {
            arrLac = Array.from(lac.split('\n'), element => `'${("0000" + (parseInt(element)).toString(16)).slice(-4)}'`);
            arrCell = [0];
            dataNew = { arrLac: arrLac, arrCell: arrCell };
            await dispatch(getData(dataNew));
        } else if (lac.trim() === "" && cell.trim() !== "") {
            arrCell = Array.from(cell.split('\n'), element => `'${("0000" + (parseInt(element)).toString(16)).slice(-4)}'`);
            arrLac = [0];
            dataNew = { arrLac: arrLac, arrCell: arrCell };
            await dispatch(getData(dataNew));
        } else {
            arrLac = Array.from(lac.split(' '), element => `'${("0000" + (parseInt(element)).toString(16)).slice(-4)}'`);
            console.log(`arrLac = ${arrLac}`);
            arrCell = Array.from(cell.split(' '), element => `'${("0000" + (parseInt(element)).toString(16)).slice(-4)}'`);
            dataNew = { arrLac: arrLac, arrCell: arrCell };
            await dispatch(getData(dataNew));
        }
    }

    const expBtnAtt = () => {
        if (data.att === '0' || data.att.length === 0) {
            alert('Нет данных!');
        } else {
            exportFromJSON({ data: data.att.toString().replaceAll(',', '\n'), fileName: 'Attached', exportType });
        }
    }

    const expBtnDet = () => {
        if (data.det === '0' || data.det.length === 0) {
            alert('Нет данных!');
        } else {
            exportFromJSON({ data: data.det.toString().replaceAll(',', '\n'), fileName: 'Detached', exportType })
        }
    }

    return (
        <>
            <div className="header">Поиск номеров по LAC/CELL</div>
            <div>{loading ? <Loader /> : null}</div>
            {error ? <div className="error">503 Service Unavailable</div> : null}
            <div className="main">
                <div className="item">
                    <label htmlFor="lac">LAC:  </label><br />
                    <textarea id="lac" placeholder="Введите LAC-и через Enter в формате DEC" value={lac} onChange={(e) => setLac(e.target.value)} />

                </div>
                <div className="item">
                    <label htmlFor="cell">Cell:  </label><br />
                    <textarea id="cell" placeholder="Введите Cell-ы через Enter в формате DEC" value={cell} onChange={(e) => setCell(e.target.value)} />
                </div>
                <div className="item">
                    <button onClick={sendData}>Get Data</button> <br />
                    <button onClick={expBtnAtt}>Attached <img src="./img/download.png" alt="#" /></button><br />
                    <button onClick={expBtnDet}>Detached <img src="./img/download.png" alt="#" /></button>
                </div>
            </div>

            <div className="modalAlertSuccess" style={dataSuccess ? { display: "block" } : { display: "none" }}>
                <h3>Данные загружены</h3>
            </div>

            <div className="modalDataEmpty" style={dataEmpty ? { display: "block" } : { display: "none" }}>
                <h3>Нет номеров по этим LAC/Cell</h3>
            </div>

            <div className="modalAlertWarning" style={alertWarning ? { display: "block" } : { display: "none" }}>
                <h3>Введите LAC или Cell</h3>
            </div>
            <div className="line"></div>
            <div className="footer">Copyright © 2024</div>
        </>
    )
}