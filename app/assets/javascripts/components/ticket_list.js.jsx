var TicketList = React.createClass({
  componentDidMount: function() {
    //最初のrender時に更新
    this.props.loadTickets(this.props.member_id);
  },
  render: function() {
    var ticketNodes = this.props.data.map(function (ticket) {
      return (
        <Ticket key={ticket.id} title={ticket.title}>
          {ticket.body}
        </Ticket>
      );
    });
    return (
      <div className="ticketList">
        {ticketNodes}
      </div>
    );
  }
});
