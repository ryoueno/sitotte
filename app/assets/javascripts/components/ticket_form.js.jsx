var TicketForm = React.createClass({
  getDefaultValues() {
    var defaults = [];
    if (this.props.edit_ticket == null || this.props.edit_ticket.length == 0) return defaults;
    var fields = ['id', 'number', 'title', 'assign_to', 'body', 'priority_id', 'state_id', 'deadline'];
    for (var i in fields) {
      defaults[fields[i]] = this.props.edit_ticket[fields[i]] == null ? '' : this.props.edit_ticket[fields[i]];
    }
    defaults['deadline'] = defaults['deadline'] === '' ? 'なし' : defaults['deadline'];
    return defaults;
  },
  //selscted付与用
  selectedOrNone(defaults, key, id) {
    if (defaults[key] == id) return 'selected';
    return '';
  },
  resetForm() {
    if (ReactDOM.findDOMNode(this.refs.title) == null) return;
    ReactDOM.findDOMNode(this.refs.id).value   = '';
    ReactDOM.findDOMNode(this.refs.title).value       = '';
    ReactDOM.findDOMNode(this.refs.body).value        = '';
    ReactDOM.findDOMNode(this.refs.assign_to).value   = 1;
    ReactDOM.findDOMNode(this.refs.state_id).value    = 1;
    ReactDOM.findDOMNode(this.refs.priority_id).value = 1;
    ReactDOM.findDOMNode(this.refs.deadline).value    = '';
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var id          = ReactDOM.findDOMNode(this.refs.id).value.trim();
    var title       = ReactDOM.findDOMNode(this.refs.title).value.trim();
    var body        = ReactDOM.findDOMNode(this.refs.body).value.trim();
    var assign_to   = ReactDOM.findDOMNode(this.refs.assign_to).value.trim();
    var state_id    = ReactDOM.findDOMNode(this.refs.state_id).value.trim();
    var priority_id = ReactDOM.findDOMNode(this.refs.priority_id).value.trim();
    var deadline    = ReactDOM.findDOMNode(this.refs.deadline).value.trim();
    var created_by  = ReactDOM.findDOMNode(this.refs.created_by).value.trim();
    if (!title || !body || !assign_to || !state_id || !priority_id || !created_by) {
      return;
    }
    //親のTicketBoxの関数を実行してstateを更新する
    this.props.onTicketSubmit({
      "id": id,
      "number": this.props.edit_ticket.number,
      "title": title,
      "body": body,
      "assign_to": assign_to,
      "state_id": state_id,
      "priority_id": priority_id,
      "deadline": deadline,
      "created_by": created_by,
    });
    this.resetForm();
    return;
  },
  getInitialState: function() {
    var states = new Object;
    states['editing'] = false;
    return states;
  },
  componentDidMount: function() {
    $('.datepicker').datetimepicker({
      format : "YYYY-MM-DD",
    });
  },
  render: function() {
    this.resetForm();
    //デフォルト値取得
    var defaults = this.getDefaultValues();
    //新規作成かどうか
    var creating = !this.props.editing || Object.keys(defaults).length == 0;
    //フォームのタイトル
    var form_title = creating ? '新しいチケット' : 'チケットNo.' + defaults.number + ' の編集';
    //編集画面だけ表示するクラス
    var edit_only = creating ? ' hide' : '';
    //新規作成だけ表示するクラス
    var create_only = !creating ? ' hide' : '';

    var assignToOptions = [
      <option
        value={this.props.current_member.id}
        selected={this.selectedOrNone(defaults, 'assign_to', this.props.current_member.id)}
      >
        自分
      </option>
    ];
    for (var i in this.props.members) {
      assignToOptions.push(
        <option
          value={this.props.members[i].id}
          selected={this.selectedOrNone(defaults, 'assign_to', this.props.members[i].id)}
        >
          {this.props.members[i].name}
        </option>
      );
    }
    var stateOptions = [];
    for (var i in this.props.states) {
      stateOptions.push(
        <option
          value={this.props.states[i].id}
          selected={this.selectedOrNone(defaults, 'state_id', this.props.states[i].id)}
        >
          {this.props.states[i].name}
        </option>
      );
    }
    var priorityOptions = [];
    for (var i in this.props.priorities) {
      priorityOptions.push(
        <option
          value={this.props.priorities[i].id}
          selected={this.selectedOrNone(defaults, 'priority_id', this.props.priorities[i].id)}
        >
          {this.props.priorities[i].name}
        </option>
      );
    }

    var editview =
      <div className="ticketView">
        <h3 className="ticket-view-title">{form_title}</h3>
        <form className="ticketForm" onSubmit={this.handleSubmit}>
          <div className="form-group">
            <input type="text" defaultValue={defaults.title} className="form-control" placeholder="タイトル" required="required" ref="title" />
          </div>
          <div className="form-group">
            <textarea type="text" rows="4" defaultValue={defaults.body} className="form-control" placeholder="本文" required="required" ref="body" />
          </div>
          <div className="form-group el-small left">
            <label className="icon-assign-to">担当</label>
            <select className="form-control" ref="assign_to">{assignToOptions}</select>
          </div>
          <div className="form-group el-small right">
            <label className="icon-status">状態</label>
            <select className="form-control" ref="state_id">{stateOptions}</select>
          </div>
          <div className="form-group el-small left">
            <label className="icon-priority">優先度</label>
            <select className="form-control" ref="priority_id">{priorityOptions}</select>
          </div>
          <div className="form-group el-small right">
            <label className="icon-deadline">期限</label>
            <input type="date" defaultValue={defaults.deadline} className="form-control" ref="deadline" />
          </div>
          <input type="hidden" value={defaults.id} ref="id" />
          <input type="hidden" value={this.props.current_member.id} ref="created_by" />
          <div className="btn-box clear">
            <a className={"btn btn-cancel" + edit_only} onClick={this.props.switchShowMode}>キャンセル</a>
            <a className={"btn btn-cancel" + create_only} data-dismiss="modal" href="#" id="close-btn">キャンセル</a>
            <input type="submit" value="作成" className="btn btn-info" />
          </div>
        </form>
      </div>;

    if (Object.keys(defaults).length > 0) {
      var showview =
        <div className="ticketView">
          <h3 className="ticket-view-title detail-view-title">No.{defaults.number}　{defaults.title}</h3>
          <div className="form-group">
            <h4 className="show-title body-title">{defaults.body}</h4>
          </div>
          <div className="form-group el-small left">
            <label className="icon-assign-to back-white">担当</label>
            <h4 className="show-title">{this.props.pickPropsById('all_members', defaults.assign_to).name}</h4>
          </div>
          <div className="form-group el-small right">
            <label className="icon-status back-white">ステータス</label>
            <h4 className="show-title">{this.props.pickPropsById('states', defaults.state_id).name}</h4>
          </div>
          <div className="form-group el-small left">
            <label className="icon-priority back-white">優先度</label>
            <h4 className="show-title">{this.props.pickPropsById('priorities', defaults.priority_id).name}</h4>
          </div>
          <div className="form-group el-small right">
            <label className="icon-deadline back-white">期日</label>
            <h4 className="show-title">{defaults.deadline}</h4>
          </div>
          <div className="btn-box clear">
            <a className="btn btn-cancel" data-dismiss="modal" href="#" id="close-btn">閉じる</a>
            <a type="button" className="btn btn-info" onClick={this.props.switchEditMode}>編集</a>
          </div>
        </div>;
    }

    return (
      <div className="ticket-detail">
        {(() => {
          if (this.props.editing || Object.keys(defaults).length == 0) {
            return editview;
          } else {
            return showview;
          }
        })()}
      </div>
    );
  }
});
