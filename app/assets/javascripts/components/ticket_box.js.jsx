var TicketBox = React.createClass({

  showModalForm(e) {
    var ticket_number = e.currentTarget.getAttribute('data-ticket');
    if (ticket_number != null) {
      this.setState({ edit_ticket: this.pickState('all_tickets', 'number', ticket_number)});
    } else {
      this.setState({ edit_ticket: []});
    }
    //編集中を解除
    this.setState({ editing: false});
    $('#modal_box').modal('show');
  },
  setSortKey(e) {
    var sortkey = ReactDOM.findDOMNode(this.refs.sortbox).value.trim();
    var order   = ReactDOM.findDOMNode(this.refs.orderbox).value.trim();
    if (sortkey != null && sortkey !== this.state.sortkey) {
      this.setState({ sortkey: sortkey});
      this.refreshTicketState();
      this.sortMembersTickets(sortkey, this.state.order);
    }
    if (order != null && order !== this.state.order) {
      this.setState({ order: order});
      this.refreshTicketState();
      this.sortMembersTickets(this.state.sortkey, order);
    }
  },
  switchEditMode(e) {
    this.setState({ editing: true});
  },
  switchShowMode(e) {
    this.setState({ editing: false});
  },
  //tickets Objectを指定されたkeyで並び替える
  sortTickets(tickets_obj, key, order) {
    key   = key   === undefined ? 'updated_at' : key;
    order = order === undefined ? 'asc'       : order;
    //デフォは降順(DESC)
    var num_a = -1;
    var num_b = 1;

    if (order === 'desc') {//指定があれば昇順(ASC)
      num_a = 1;
      num_b = -1;
    }

    var tickets = [];
    for (var i in tickets_obj) {
      tickets.push(tickets_obj[i]);
    }
    tickets = tickets.sort(function(a, b) {
      var x = a[key];
      var y = b[key];
      if (x > y) return num_a;
      if (x < y) return num_b;
      return 0;
    });

   return tickets; // ソート後の配列を返す
  },
  //Member全員のチケットを指定されたkeyでソートする
  sortMembersTickets(key, order) {
    key   = key   === undefined ? 'updated_at'  : key;
    order = order === undefined ? 'desc' : order;
    for (var i in this.props.all_members) {
      var member_id = this.props.all_members[i].id;
      var state = {};
      if (this.state['tickets' + member_id] != null) {
        state['tickets' + member_id] = this.sortTickets(this.state['tickets' + member_id], key, order);
        this.setState(this.sortTickets(state, this.state.sortkey, this.state.order));
      }
    }
  },
  //KeyとIDを指定してpropsからデータ取得
  pickPropsById(key, id) {
    for (var i in this.props[key]) {
      if (this.props[key][i].id == id) return this.props[key][i];
    }
  },
  //KeyとIDを指定してstateからデータを削除
  removeStateById(key, id) {
    for (var i in this.state[key]) {
      if (this.state[key][i].id == id) this.state[key].splice(i, 1); //1つ削除
    }
  },
  //KeyとIDを指定してstateからデータ取得
  pickState(key, field, value) {
    for (var i in this.state[key]) {
      if (this.state[key][i][field] == value) return this.state[key][i];
    }
  },
  loadTicketsFromServer: function(id) {
    $.ajax({
      url: this.props.get_url + id,
      dataType: 'json',
      success: function(result) {
        var state = [];
        state['tickets' + id] = result.tickets;
        this.setState(state);
      }.bind(this),
      error: function(xhr, status, err) {

      }.bind(this)
    });
  },
  handleTicketSubmit: function(ticket) {
    //親のstate更新
    var state = new Object;
    //新規の場合はticket numberを生成, 更新の場合は前のチケットをstateから削除
    if (ticket['id'] === '') {
      ticket['number'] = Object.keys(this.state.all_tickets).length + 1;
    } else {
      var old_ticket = this.pickState('all_tickets', 'id', ticket['id']);
      this.removeStateById('tickets' + old_ticket['assign_to'], ticket['id']);
      this.removeStateById('all_tickets', ticket['id']);
    }
    state['tickets' + ticket.assign_to] = [ticket].concat(this.state['tickets' + ticket.assign_to]);
    state['all_tickets'] = [ticket].concat(this.state['all_tickets']);
    ticket['group_id'] = this.props.group.id;
    //idの有無でupdateかcreateを分岐
    var url   = ticket['id'] === '' ? this.props.url_create : this.props.url_update + '/' + ticket['id'];
    var type  = ticket['id'] === '' ? 'POST' : 'PUT';
    var alert = ticket['id'] === '' ? '#created-alert' : '#updated-alert';
    this.setState(state);
    $.ajax({
      url: url,
      dataType: 'json',
      type: type,
      data: ticket,
      success: function(data) {
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
    var clickMe = document.getElementById("close-btn");
    clickMe.click();
    $(alert).fadeIn(500).delay(2000).fadeOut(500);
  },
  //state.all_ticketsからtickets{member_id}を更新
  //state.all_ticketsに更新があったときに実行し、各メンバーのチケットを全て更新する
  //stateはthis.props.tickets{member_id}.{ticket_id} で取得できるようにする
  refreshTicketState: function() {
    sortkey = this.state.sortkey;
    var state = new Object;
    for (var i in this.state.all_tickets) {
      var member_id = this.state.all_tickets[i].assign_to;
      if (state['tickets' + member_id] == null) state['tickets' + member_id] = {};
      state['tickets' + member_id][this.state.all_tickets[i].id] = this.state.all_tickets[i];
    }
    //強引に初期化　（stateが使い物にならなかったので）
    for (var i in this.props.all_members) {
      state['tickets' + this.props.all_members[i].id] = this.sortTickets(state['tickets' + this.props.all_members[i].id], this.state.sortkey, this.state.order);
    }
    this.setState(state);
  },
  getInitialState: function() {
    // tickets3 = [ticekts] のように tickets+member_idをkeyとしてtickets-stateを初期化
    var states = new Object;
    for (var i in this.props.members) {
      states['tickets' + this.props.members[i].id] = [];
    }
    states['tickets' + this.props.current_member.id] = [];
    states['all_tickets'] = this.props.all_tickets;
    states['edit_ticket'] = [];
    states['sortkey'] = 'updated_at';
    states['order'] = 'desc';
    states['editing'] = false;

    return states;
  },
  componentDidMount: function() {
    //最初のrender時に更新
    this.refreshTicketState();
  },
  render: function() {
    var ticket_list = [];
    ticket_list.push(
      <div key={this.props.current_member.id} className="tab-pane active" id={"user-tab" + this.props.current_member.id}>
        <TicketList
          loadTickets={this.loadTicketsFromServer}
          showModalForm={this.showModalForm}
          pickPropsById={this.pickPropsById}
          all_members={this.props.all_members}
          tickets={this.state['tickets' + this.props.current_member.id]}
        />
      </div>
    );
    for (var i in this.props.members) {
      ticket_list.push(
        <div key={this.props.members[i].id} className="tab-pane" id={"user-tab" + this.props.members[i].id}>
          <TicketList
            loadTickets={this.loadTicketsFromServer}
            showModalForm={this.showModalForm}
            pickPropsById={this.pickPropsById}
            all_members={this.props.all_members}
            tickets={this.state['tickets' + this.props.members[i].id]}
          />
        </div>
      );
    }
    return(
      <div className="main-container">
        <div className="inner-header">
          <div className="inner-title">
            <h3>みんなのチケット</h3>
          </div>
          <ul className="content-menu-list">
            <li className="content-menu" onClick={this.showModalForm}>
              <div className="menu-icon icon-all-tickets"></div>
              <div className="menu-label">みんなのチケット</div>
            </li>
            <li className="content-menu" onClick={this.showModalForm}>
              <div className="menu-icon icon-create"></div>
              <div className="menu-label">チケットをつくる</div>
            </li>
            <li className="content-menu" onClick={this.showModalForm}>
              <div className="menu-icon icon-dustbox"></div>
              <div className="menu-label">ごみ箱</div>
            </li>
          </ul>
        </div>
        <div className="inner-body clear">
          <select className="selectpicker input-small sort-box" ref="sortbox" onChange={this.setSortKey}>
            <option value="updated_at">あたらしい順</option>
            <option value="id">チケット番号順</option>
            <option value="title">タイトル順</option>
          </select>

          <select className="selectpicker input-small order-box" ref="orderbox" onChange={this.setSortKey}>
            <option value="desc">くだり順</option>
            <option value="asc">のぼり順</option>
          </select>

          <div className="modal fade" id="modal_box">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="box_inner">
                  <TicketForm
                    key={this.props.current_member.id}
                    edit_ticket={this.state.edit_ticket}
                    onTicketSubmit={this.handleTicketSubmit}
                    switchEditMode={this.switchEditMode}
                    switchShowMode={this.switchShowMode}
                    pickPropsById={this.pickPropsById}
                    current_member={this.props.current_member}
                    members={this.props.members}
                    states={this.props.states}
                    priorities={this.props.priorities}
                    editing={this.state.editing}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="tab-content content-list">
            {ticket_list}
          </div>
        </div>
      </div>
    );
  }
});
