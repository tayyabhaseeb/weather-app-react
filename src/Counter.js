import React, { Component } from "react";

export default class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: 5 };
    this.handleAdd = this.handleAdd.bind(this);
    this.handleSub = this.handleSub.bind(this);
  }

  handleAdd() {
    this.setState((prevState) => {
      return { count: prevState.count + 1 };
    });
  }

  handleSub() {
    this.setState((prev) => {
      return { count: prev.count - 1 };
    });
  }

  render() {
    return (
      <div>
        <button onClick={this.handleSub}>-</button>
        <span>{this.state.count}</span>
        <button onClick={this.handleAdd}>+</button>
      </div>
    );
  }
}
