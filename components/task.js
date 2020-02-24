import React, {Component} from 'react';
import { Text, View } from "react-native";
import styles from './styles';

export default class Task extends Component {
    render(){
        const props = this.props;
        return(
            <View style={styles.task}>
                <View style={styles.taskDescription}>
                    <Text style={styles.title}>
                        {props.title}
                    </Text>
                    <Text style={styles.text} numberOfLines={2}>
                        {props.text}
                    </Text>
                </View>
                <View style={styles.taskActions}>
                    
                </View>
            </View>
        )
    }
}