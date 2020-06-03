import React from 'react'
import CardTemplate from '../../../../../ui/cards/SimpleCard/CardTemplate'
import styles from '../fromview.module.css';

export const HeadingWidget =({
    displayText,
    name
}) =>(
    <CardTemplate
      header = "true"
    >
        <div className={styles.heading_}>
             {displayText ? displayText : name}
        </div>
    </CardTemplate>
  ) 
