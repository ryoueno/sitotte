var TicketList = React.createClass({
  render: function() {
    var ticketNodes = [];
    for (var i in this.props.tickets) {
      ticketNodes.push(
        <Ticket
          key={this.props.tickets[i].id}
          ticket={this.props.tickets[i]}
          showModalForm={this.props.showModalForm}
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
