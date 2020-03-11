
import React from 'react';
import Loader from 'react-loader-spinner'
import './loader.css'
export const LoaderDots = ({ withMargin, height, width }) => (
    <Loader
        type="Oval"
        color="#4158d0"
        height={height}
        width={width}
        className={withMargin? "container" : "loader_container"}
    />
);