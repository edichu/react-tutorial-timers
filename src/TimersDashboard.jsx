import React, { Component } from 'react';
import 'semantic-ui-css/semantic.min.css';
import EditableTimerList from './EditableTimerList';
import ToggleableTimerForm from './ToggleableTimerForm';
import uuid from 'uuid';

class TimersDashboard extends Component {
    state = {
        timers: []
    };

    componentDidMount() {
        setInterval(() => this.getInitialState(), 1000);
    }

    getInitialState = () => {
        var url = 'http://localhost:5000/getState';

        fetch(url, {
            method: 'GET',
            mode: 'cors',
            headers: { 'Content-Type': 'application/json' },
            redirect: 'follow',
            referrer: 'no-referrer'
        }).then(res => res.json())
            .then(response => this.setState(response))
            .catch(error => console.error('Error:', error));
    }

    syncState = (objState) => {
        var url = 'http://localhost:5000/syncState';
        const content = JSON.stringify(objState);

        fetch(url, {
            method: 'POST',
            mode: 'cors',
            body: content,
            headers: { 'Content-Type': 'application/json' },
            redirect: 'follow',
            referrer: 'no-referrer'
        }).then(res => res.json())
            .catch(error => console.error('Error:', error));
    }

    handleCreateFormSubmit = (timer) => {
        const t = {
            title: timer.title,
            project: timer.project,
            id: uuid.v4(),
            elapsed: 0,
            runningSince: null
        };

        this.setState({
            timers: this.state.timers.concat(t)
        });
    }

    handleEditFormSubmit = (attrs) => {
        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === attrs.id) {
                    return Object.assign({}, timer, { title: attrs.title, project: attrs.project })
                } else {
                    return timer;
                }
            })
        });
    }

    handleTrashClick = (timerId) => {
        this.setState({
            timers: this.state.timers.filter(timer => timer.id !== timerId)
        });
    }

    handleStartClick = (timerId) => {
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    return Object.assign({}, timer, {
                        runningSince: now
                    });
                } else {
                    return timer;
                }
            })
        });
    }

    handleStopClick = (timerId) => {
        const now = Date.now();

        this.setState({
            timers: this.state.timers.map((timer) => {
                if (timer.id === timerId) {
                    const lastElapsed = now - timer.runningSince;
                    return Object.assign({}, timer, {
                        runningSince: null,
                        elapsed: timer.elapsed + lastElapsed
                    });
                } else {
                    return timer;
                }
            })
        });
    }

    render() {
        if (this.state.timers.length > 0) {
            this.syncState(this.state);
        }

        return (
            <div className='ui three column centered grid'>
                <div className='column'>
                    <EditableTimerList
                        timers={this.state.timers}
                        onFormSubmit={this.handleEditFormSubmit}
                        onTrashClick={this.handleTrashClick}
                        onStartClick={this.handleStartClick}
                        onStopClick={this.handleStopClick}
                    />
                    <ToggleableTimerForm
                        onFormSubmit={this.handleCreateFormSubmit}
                    />
                </div>
            </div>
        );
    }
}

export default TimersDashboard;