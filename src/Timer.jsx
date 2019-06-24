import React, { Component } from 'react';
import TimerActionButton from './TimerActionButton';

class Timer extends Component {
    forceUpdateInterval;

    componentDidMount() {
        this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
    }

    componentWillUnmount() {
        clearInterval(this.forceUpdateInterval);
    }

    handleTrashClick = () => {
        this.props.onTrashClick(this.props.id);
    }

    handleStartClick = () => {
        this.props.onStartClick(this.props.id);
    }

    handleStopClick = () => {
        this.props.onStopClick(this.props.id);
    }

    msToTime = (s) => {
        var ms = s % 1000;
        s = (s - ms) / 1000;
        var secs = s % 60;
        s = (s - secs) / 60;
        var mins = s % 60;
        var hrs = (s - mins) / 60;

        return hrs + ':' + mins + ':' + secs;
    }

    render() {
        let elapsedString = 0;

        if(!!this.props.runningSince) {
            elapsedString = this.msToTime(this.props.elapsed + (Date.now() - this.props.runningSince));
        } else {
            elapsedString = this.msToTime(this.props.elapsed);
        }
        
        return (
            <div className='ui centered card'>
                <div className='content'>
                    <div className='header'>
                        {this.props.title}
                    </div>
                    <div className='meta'>
                        {this.props.project}
                    </div>
                    <div className='center aligned description'>
                        <h2>{elapsedString}</h2>
                    </div>
                    <div className='extra content'>
                        <span className='right floated edit icon' onClick={this.props.onEditClick}>
                            <i className='edit icon' />
                        </span>
                        <span className='right floated trash icon' onClick={this.handleTrashClick}>
                            <i className='trash icon' />
                        </span>
                    </div>
                </div>
                
                <TimerActionButton
                    timerIsRunning={!!this.props.runningSince}
                    onStartClick={this.handleStartClick}
                    onStopClick={this.handleStopClick}
                />
            </div>

        );
    }
}

export default Timer;