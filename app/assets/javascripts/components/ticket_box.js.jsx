var TicketBoxList = React.createClass({
  showModalForm(e) {
    $('#modal_box').modal('show');
  },
  loadTicketsFromServer: function(id) {
    $.ajax({
      url: this.props.url + id,
      dataType: 'json',
      success: function(result) {
        var state = [];
        state['data' + id] = result.data;
        this.setState(state);
      }.bind(this),
      error: function(xhr, status, err) {

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
    // data3 = [data] のように data+idをkeyとしてstateを初期化
    var data = new Object;
    for (var i in this.props.members_id) {
      data['data' + this.props.members_id[i]] = [];
    }
    data['data' + this.props.current_member_id] = [];
    return data;
  },
  render: function() {
    var ticket_list = [];
    ticket_list.push(
      <div key={this.props.current_member_id} className="tab-pane active" id={"user-tab" + this.props.current_member_id}>
        <TicketList loadTickets={this.loadTicketsFromServer} data={this.state['data' + this.props.current_member_id]} member_id={this.props.current_member_id} />
      </div>
    );
    for (var i in this.props.members_id) {
      ticket_list.push(
        <div key={this.props.members_id[i]} className="tab-pane" id={"user-tab" + this.props.members_id[i]}>
          <TicketList key={this.props.members_id[i]} loadTickets={this.loadTicketsFromServer} data={this.state['data' + this.props.members_id[i]]} member_id={this.props.members_id[i]} />
        </div>
      );
    }
    return(
      <div>
        <div className="click_btn" onClick={this.showModalForm}>
          作成
        </div>
        <div className="modal fade" id="modal_box">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="box_inner">
                <TicketForm key={this.props.current_member_id} onTicketSubmit={this.handleTicketSubmit} member_id={this.props.current_member_id}/>
                <p className="text-center"><a className="btn btn-primary" data-dismiss="modal" href="#" id="close-btn">閉じる</a></p>
              </div>
            </div>
          </div>
        </div>
        <div className="tab-content">
          {ticket_list}
        </div>
      </div>
    );
  }
});

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
  render: function() {
    return (
      <form className="ticketForm" onSubmit={this.props.onTicketSubmit}>
        <input type="text" placeholder="タイトル" ref="title" />
        <input type="text" placeholder="本文" ref="body" />
        <input type="number" placeholder="ユーザID" ref="assign_to" />
        <input type="number" placeholder="ステータス" ref="state_id" />
        <input type="hidden" value={this.props.member_id} ref="created_by" />
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
