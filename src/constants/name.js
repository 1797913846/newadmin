let r = localStorage.getItem('role');
console.log('我是r', r);
let name;
if (r == 1) {
    name =
        [
            { key: 'user_account_id', name: '机构代码' },
            { key: 'user_account_name', name: '机构名称' },
            { key: 'trade_permission_desc', name: '交易权限' },
            { key: 'create_time', name: '开户日期' },
            { key: 'expires_time', name: '服务有效期' },
            { key: 'memo', name: '备注' }
        ]
} else {
    name =
        [
            { key: 'user_account_id', name: '用户代码' },
            { key: 'user_account_name', name: '用户名称' },
            { key: 'trade_permission_desc', name: '交易权限' },
            { key: 'create_time', name: '开户日期' },
            { key: 'expires_time', name: '服务有效期' },
            { key: 'memo', name: '备注' }
        ]
}

export const NAME = name;