
import React from 'react';
import Loader from 'react-loader-spinner'

function Loaders() {
    return (
        // <div className="loader center">
        //   <i className="fa fa-cog fa-spin" />
        // </div>
        <div style={{ display: "flex", marginTop:'280px' ,justifyContent: "center", alignItems: "center" }}>
            <div>
                <Loader
                    type="MutatingDots"
                    color="#4158d0"
                    height={100}
                    width={100}
                    // timeout={3000} //3 secs
                />
            </div>
            {/* <div>
               <img src={require( '../../../assets/logo.png')} style ={{width: '200px',height :'200px'}}></img>
            </div> */}
       
        </div>
    );
}

export default Loaders