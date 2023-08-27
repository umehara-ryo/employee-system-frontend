import React, {useEffect, useRef, useState} from 'react'
import {Col, Drawer, List, Row} from "antd";
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Card } from 'antd';
import axios from "axios";
import * as ECharts from 'echarts';
import _ from 'lodash';

const { Meta } = Card;

const data = [
    'Racing car sprays burning fuel into crowd.',
    'Japanese princess to wed commoner.',
    'Australian walks 100km after outback crash.',
    'Man charged over missing wedding girl.',
    'Los Angeles battles huge wildfires.',
];


export default function Home() {
    const [open, setOpen] = useState(false);
    const [pieChart, setPieChart] = useState(null);
    const [viewList,setViewList] = useState([]);
    const [starList,setStarList] = useState([]);
    const [allList, setallList] = useState([])
    const barRef = useRef();
    const pieRef = useRef();
    useEffect(()=>{
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6')
            .then(res=>{
                console.log(res.data)
                setViewList(res.data);
            })
    },[])

    useEffect(()=>{
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6')
            .then(res=>{
                console.log(res.data)
                setStarList(res.data);
            })
    },[])

    useEffect(() => {

        axios.get("/news?publishState=2&_expand=category").then(res => {
            // console.log(res.data)
            // console.log()
            renderBarView(_.groupBy(res.data, item => item.category.title))

            setallList(res.data)
        })

        return () => {
            window.onresize = null
        }
    }, [])

    const user = JSON.parse(localStorage.getItem('token'));

    const renderBarView = (obj) => {
        var myChart = ECharts.init(barRef.current);

        // チャートの構成項目とデータを指定する
        var option = {
            title: {
                text: 'ニュースカテゴリ図'
            },
            tooltip: {},
            legend: {
                data: ['数']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: "45",
                    interval: 0
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [{
                name: '数',
                type: 'bar',
                barWidth:'25%',
                data: Object.values(obj).map(item => item.length)
            }]
        };

        // 指定した構成項目とデータを使用して、グラフで表示する
        myChart.setOption(option);


        window.onresize = () => {
            // console.log("resize")
            myChart.resize()
        }
    }


    const renderPieView = (obj) => {
        //データ処理

        var currentList =allList.filter(item=>item.author===user.username)
        var groupObj = _.groupBy(currentList,item=>item.category.title)
        var list = []
        for(var i in groupObj){
            list.push({
                name:i,
                value:groupObj[i].length
            })
        }
        console.log(list);
        var myChart;
        if(!pieChart){
            myChart = ECharts.init(pieRef.current);
            setPieChart(myChart)
        }else{
            myChart = pieChart
        }
        var option;

        option = {
            title: {
                text: '現ユーザーニュースカテゴリ図',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '公開数',
                    type: 'pie',
                    radius: '50%',
                    data: list,
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };

        option && myChart.setOption(option);

    }

    const showDrawer = () => {
        setTimeout(()=>{
            setOpen(true);
            renderPieView();
        },0)

    };
    const onClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="最もよく訪れる" bordered={true}>
                        <List
                            size="small"
                            //header={<div>Header</div>}
                            //footer={<div>Footer</div>}
                            //bordered
                            dataSource={viewList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="最も多くのいいねを受ける" bordered={true}>
                        <List
                            size="small"
                            //header={<div>Header</div>}
                            //footer={<div>Footer</div>}
                            //bordered
                            dataSource={starList}
                            renderItem={(item) => <List.Item><a href={`#/news-manage/preview/${item.id}`}>{item.title}</a></List.Item>}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        style={{
                            width: 300,
                        }}
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={showDrawer}/>,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://web-umehara.oss-cn-hangzhou.aliyuncs.com/497b03ee-cab0-415a-95a2-1a66a4f5172b.jpg" />}
                            title={user.username}
                            description={
                                <div>
                                    <b>{user.region?user.region:'グローバル'}</b>
                                    <span style={{
                                        paddingLeft:'20px'
                                    }}>{user.role.roleName}</span>

                                </div>
                            }
                        />
                    </Card>
                </Col>
            </Row>

            <Drawer  width='500px' title="個人情報" placement="right" onClose={onClose} open={open}>
                <div ref={pieRef} style={{
                    width: '100%',
                    height: "400px",
                    marginTop: "30px"
                }}></div>
            </Drawer>

            <div ref={barRef} style={{
                width: '100%',
                height: "400px",
                marginTop: "30px"
            }}></div>
        </div>
    )
}
