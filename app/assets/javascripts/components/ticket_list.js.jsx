var TicketList = React.createClass({
  render: function() {
    var ticketNodes = [];
    for (var i in this.props.tickets) {
      ticketNodes.push(
        <Ticket
          key={this.props.tickets[i].id}
          class={i % 2 == 0 ? 'left' : 'right'}
          ticket={this.props.tickets[i]}
          pickPropsById={this.props.pickPropsById}
          showModalForm={this.props.showModalForm}
          all_members={this.props.all_members}
        >
          {this.props.tickets[i].body}
        </Ticket>
      );
    }
    return (
      <div className="ticketList">
        {ticketNodes}
      </div>
    );
  }
});
