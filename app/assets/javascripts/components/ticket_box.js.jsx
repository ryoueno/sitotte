var TicketBox = React.createClass({
  getInitialState: function() {
    return {data: []};
  },
  loadTicketsFromServer: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(result) {
        this.setState({data: result.data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.loadTicketsFromServer();
    setInterval(this.loadTicketsFromServer, this.props.pollInterval);
  },
  render: function() {
    return (
      <div className="ticketBox">
        <TicketList data={this.state.data} />
        <TicketForm />
      </div>
    );
  }
});

var TicketList = React.createClass({
  render: function() {
    var ticketNodes = this.props.data.map(function (ticket) {
      return (
        <Ticket author={ticket.author}>
          {ticket.text}
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

var TicketForm = React.createClass({
  render: function() {
    return (
      <div className="ticketForm">
        Hello, world! I am a TicketForm.
      </div>
    );
  }
});

var Ticket = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="ticket">
        <h2 className="ticketAuther">
          {this.props.author}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
