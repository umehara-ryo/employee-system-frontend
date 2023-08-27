import React, {useEffect, useState} from 'react'
import {Button, Input, Modal, Popover, Row, Switch, Table, Tag} from "antd";
import {
    DeleteOutlined,
    EditOutlined,
    ExclamationCircleOutlined,
} from '@ant-design/icons';
import axios from "axios";
import './Home.css'
import BackGround from '../../../resources/img/background1.jpg'


export default function Home() {
    const [dataSource, setDataSourse] = useState([])
    useEffect(() => {
        axios.get('/employee/search').then(res => {
            console.log(res);
            setDataSourse(res.data.data)
        })
    }, [])

    const columns = [
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>社員番号</div>,
            dataIndex: 'empCd',
            align:"center",
            render: (empCd) => {
                return <div style={{
                    color: "#337ab7"
                }}>{empCd}</div>
            }
        },
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>名前</div>,
            align:"center",
            dataIndex: 'name',
            render: (name) => {
                return <i style={{
                    color: "#337ab7"
                }}>{name}</i>
            }
        },
        {

            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>生年月日</div>,
            dataIndex: 'birthday',
            align:"center",
            render: (birthday) => {
                return <div style={{
                    color:'#337ab7'
                }}>{birthday}</div>
            }
        },

        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>国籍</div>,
            align:"center",
            dataIndex: 'nationalityName',
            render: (nationalityName) => {
                return <div style={{
                    color:'#337ab7'
                }} >{nationalityName}</div>
            }
        },
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>性別</div>,
            align:"center",
            dataIndex: 'genderName',
            render: (genderName) => {
                return <Tag color={genderName === '女性' ? 'lightpink' : '#337ab7'}>{genderName}</Tag>
            }
        },
        {
            title: () => <div style={{
                fontSize: '16px',
                fontWeight: 'bold',
                textAlign: 'center',
                //backgroundImage: `url(${BackGround})`,
                color: "#337ab7"
            }}>操作</div>,
            align:"center",
            render: (item) => {
                return <div>

                    <Button type="primary" style={{backgroundColor:'#337ab7'}}>変更</Button>

                    <Button danger onClick={() => confirmDelete(item)}>削除</Button>
                </div>
            }
        },
    ];

    const switchMethod = (item) => {
        item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
        console.log(item);
        setDataSourse([...dataSource]);
        if (item.grade === 1) {
            axios.patch(`http://localhost:5000/rights/${item.id}`, {pagepermisson: item.pagepermisson});
        } else {
            axios.patch(`http://localhost:5000/children/${item.id}`, {pagepermisson: item.pagepermisson});
        }
    };

    const {confirm} = Modal;
    const confirmDelete = (item) => {
        confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined/>,
            content: '削除しますか',
            okText: '削除',
            cancelText: 'キャンセル',
            onOk() {
                console.log('OK');
                deleteMethod(item);
            },
            onCancel() {
                console.log('Cancel');
            }
        });
    }
    const deleteMethod = (item) => {
        if (item.grade === 1) {
            console.log(item);
            setDataSourse(dataSource.filter(data => data.id !== item.id));
            axios.delete(`http://localhost:5000/rights/${item.id}`);
        } else {
            const rightId = item.rightId;
            let list = dataSource.filter(data => data.id === rightId)
            console.log(list)
            list[0].children = list[0].children.filter(data => data.id !== item.id);
            // console.log(list)
            // console.log(item.id)
            // console.log(list[0].children)
            const newData = dataSource.filter(() => true);
            newData.forEach(item => {
                if (item.id === rightId) {
                    item.children = list[0].children;
                }
            })
            setDataSourse(newData);
            //axios.delete(`http://localhost:5000/children/${item.id}`);
        }
    }
    return (


        <div>
            <div style={{
                color: "#337ab7",
                fontSize: '30px',
                textAlign: "center"
            }}>社員情報一覧<br/></div>

            <div>
                <Button style={{
                    left: '80%',
                    backgroundColor: 'rgba(92,184,92)',
                    color: 'white'
                }}>社員登録</Button>
                <Button style={{
                    left: '82%',
                    backgroundColor: 'rgba(240, 173, 78)',
                    color: 'white'
                }}>ログアウト</Button>
            </div>
            <br/>
            <Input style={{
                width: "200px",
                left: "70%"
            }}></Input>
            <Button style={{
                left: '72%',
                backgroundColor: 'rgba(238, 238，238)',
                color: 'rgba(51, 122, 183)'
            }}>社員検索</Button>

            <br/> <br/>

            <div>
                <Table style={{
                backgroundImage: `url(${BackGround})`,
                height: "100%",
                backgroundSize: '100% 100%',
            }}

                       size='middle'

                       dataSource={dataSource}
                        columns={columns}
                        rowKey={item => item.empCd}
                        pagination={{
                            pageSize: 6
                        }}
            /></div>

        </div>
    )
}
