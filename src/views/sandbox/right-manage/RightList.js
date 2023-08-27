import React, {useEffect, useState} from 'react'
import {Button, Table, Modal, Tag, Popover, Switch} from "antd";
import axios from "axios";
import { DeleteOutlined,EditOutlined} from '@ant-design/icons';
import { ExclamationCircleOutlined } from '@ant-design/icons';


export default function RightList() {

    const [dataSource,setDataSourse] = useState( [])
    useEffect(()=>{
            axios.get('http://localhost:5000/rights?_embed=children').then(res=>{

                res.data.forEach(i=>{
                    if(i.children.length===0){
                        i.children = null;
                    }
                })
                setDataSourse(res.data)
            })
    },[])



    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            render: (id)=>{
                return<b>{id}</b>
            }
        },
        {
            title: '権限名',
            dataIndex: 'title',
            render: (title)=>{
                return <i>{title}</i>
            }
        },
        {
            title: '権限パス',
            dataIndex: 'key',
            render: (key)=>{
                return <Tag color='lightpink'>{key}</Tag>
            }
        },
        {
            title: '操作',
            render: (item)=>{
                return　<div>
                    <Popover  content={<div style={{textAlign:'center'}}>
                        <Switch checked={item.pagepermisson}　onChange={()=>switchMethod(item)}></Switch>
                    </div>} title="変更項目"　trigger={item.pagepermisson !== undefined ? 'click' : null}>
                        <Button type="primary" shape="circle" icon={<EditOutlined/>} disabled={!item.pagepermisson}
                        ></Button>
                    </Popover>


                    <Button danger shape="circle" icon={<DeleteOutlined/>}  onClick={()=>confirmDelete(item)}></Button>
                </div>
            }
        },
    ];

   const switchMethod = (item)=>{
       item.pagepermisson = item.pagepermisson === 1 ? 0 : 1;
       console.log(item);
       setDataSourse([...dataSource]);
       if (item.grade===1){
           axios.patch(`http://localhost:5000/rights/${item.id}`,{pagepermisson : item.pagepermisson});
       }else {
           axios.patch(`http://localhost:5000/children/${item.id}`,{pagepermisson : item.pagepermisson});
       }
   };

    const {confirm} = Modal;
    const confirmDelete = (item)=>{
       confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined />,
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
    const deleteMethod = (item)=>{
        if(item.grade===1) {
            console.log(item);
            setDataSourse(dataSource.filter(data => data.id !== item.id));
            axios.delete(`http://localhost:5000/rights/${item.id}`);
        }else {
            const rightId = item.rightId;
            let list = dataSource.filter(data => data.id === rightId)
            console.log(list)
            list[0].children = list[0].children.filter(data => data.id !== item.id);
            // console.log(list)
            // console.log(item.id)
            // console.log(list[0].children)
            const newData = dataSource.filter(()=>true);
            newData.forEach(item=>{
                if(item.id === rightId){
                    item.children = list[0].children;
                }
            })
            setDataSourse(newData);
            //axios.delete(`http://localhost:5000/children/${item.id}`);
        }
    }

    return (
        <div>

            <Table dataSource={dataSource} columns={columns}　
            pagination={{
                pageSize:5
            }}
            />;
        </div>
    )
}
