import React from 'react'
import ListBody from "./ListBody";

const styles = {
    li: {
        display: "flex",
        background: "white",
        boxShadow: "2px 4px 10px rgba(0, 0, 0, 0.2)",
        color: "#707070",
        marginBottom: "0.3em",
        cursor: "pointer",
        alignItems: "stretch",
        justifyContent: "space-between"
    },
    itemleft: {
        flexGrow: 8,
        display: "flex",
        justifyContent: "flex-start"
    },
    cross: {
        marginRight: '16px',
        marginTop: '10px'

    },
    leftWall: color => ({
        width: "0.5em",
        backgroundColor: color
    })
};

export default function ListItem({
    handleOnClick,
    handleDeleteOnClick,
    data,
    completed, ...reset
}) {

    return (
        <li
            style={styles.li}
        >
            <div style={styles.itemleft} onClick={(evt) => handleOnClick(evt, data)} >
                <div style={styles.leftWall(completed ? "var(--bg)" : "red")} />
                <ListBody name={data.name} description="" />
            </div>
            <span onClick={() => handleDeleteOnClick(data)}>
                <i className='fas fa-times' style={styles.cross}></i>
            </span>
        </li>
    )
}
