import React from 'react';
import {Link} from 'react-router-dom';
import {List} from 'semantic-ui-react';

export default class Navbar extends React.Component {

	render() {
		if(this.props.isLogged) {
			return (
			<div style={{"backgroundColor":"lightblue","height":80}}>
				<List>
					<List.Item><Link to="/list">Shopping List</Link></List.Item>
					<List.Item><Link to="/form">Add new item</Link></List.Item>
					<List.Item><Link to="/" onClick={() => this.props.logout()}>
						Logout</Link></List.Item>					
				</List>
			</div>
			)
		} else {
			return (
			<div style={{"backgroundColor":"lightblue","height":80}}>
			</div>
			)
		}
	}
}