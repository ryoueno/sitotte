var TicketBox = React.createClass({
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
  handleTicketSubmit: function(ticket) {
    //親のstate更新
    this.setState({data: [ticket].concat(this.state.data)});
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      type: 'POST',
      data: ticket,
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    var clickMe = document.getElementById("close-btn");
    clickMe.click();
    $('#success-alert').fadeIn(500).delay(2000).fadeOut(500);
  },
  getInitialState: function() {
    return {
      data: [],
      member_id: this.props.member_id
    };
  },
  componentDidMount: function() {
    this.loadTicketsFromServer();
    //pollIntervalおきにデータ更新
    //setInterval(this.loadTicketsFromServer, this.props.pollInterval);
  },
  //TicketFrom送信時に親(TicketBox)の持つstate更新用のコールバック関数を渡しておく
  render: function() {
    return (
      <div className="ticketBox">
        <div className="modal fade" id="modal_box">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="box_inner">
                <TicketForm onTicketSubmit={this.handleTicketSubmit} member_id={this.state.member_id}/>
                <p className="text-center"><a className="btn btn-primary" data-dismiss="modal" href="#" id="close-btn">閉じる</a></p>
              </div>
            </div>
          </div>
        </div>
        <TicketList data={this.state.data} />
      </div>
    );
  }
});

var TicketList = React.createClass({
  render: function() {
    var ticketNodes = this.props.data.map(function (ticket) {
      return (
        <Ticket title={ticket.title}>
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

var TicketForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = ReactDOM.findDOMNode(this.refs.title).value.trim();
    var body = ReactDOM.findDOMNode(this.refs.body).value.trim();
    var assign_to = ReactDOM.findDOMNode(this.refs.assign_to).value.trim();
    var state_id = ReactDOM.findDOMNode(this.refs.state_id).value.trim();
    var created_by = ReactDOM.findDOMNode(this.refs.created_by).value.trim();
    if (false) {
      return;
    }
    //親のTicketBoxの関数を実行してstateを更新する
    this.props.onTicketSubmit({"title": title, "body": body, "assign_to": assign_to, "state_id": state_id, "created_by": created_by});
    ReactDOM.findDOMNode(this.refs.title).value = '';
    ReactDOM.findDOMNode(this.refs.body).value = '';
    ReactDOM.findDOMNode(this.refs.assign_to).value = '';
    ReactDOM.findDOMNode(this.refs.state_id).value = '';
    return;
  },
  getInitialState() {
    return {
      member_id: this.props.member_id
    };
  },
  render: function() {
    return (
      <form className="ticketForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="タイトル" ref="title" />
        <input type="text" placeholder="本文" ref="body" />
        <input type="number" placeholder="ユーザID" ref="assign_to" />
        <input type="number" placeholder="ステータス" ref="state_id" />
        <input type="hidden" value={this.state.member_id} ref="created_by" />
        <input type="submit" value="Post" className="btn btn-primary" />
      </form>
    );
  }
});

var Ticket = React.createClass({
  render: function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize: true});
    return (
      <div className="ticket">
        <h2 className="ticketTitle">
          {this.props.title}
        </h2>
        <span dangerouslySetInnerHTML={{__html: rawMarkup}} />
      </div>
    );
  }
});
