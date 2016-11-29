var Ticket = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="ticket">
        <h2 className="ticketTitle" onClick={this.props.showModalForm} data-ticket={this.props.ticket.id}>
          {this.props.ticket.title}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
