
import React from 'react';
import Loader from 'react-loader-spinner'

function Loaders() {
    return (
        <div style={{ display: "flex", marginTop:'280px' ,justifyContent: "center", alignItems: "center" }}>
            <div>
                <Loader
                    type="Oval"
                    color="#4158d0"
                    height={100}
                    width={100}
                />
            </div>
            {/* <div>
               <img src={require( '../../../assets/logo.png')} style ={{width: '200px',height :'200px'}}></img>
            </div> */}
       
        </div>
    );
}

export default Loaders