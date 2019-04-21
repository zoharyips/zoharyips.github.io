package metro

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
)

// Print : 打印邻接表
func Print() {
	nodes := read()
	nodes.Show()
}

// GetJSON : 输出邻接表为 JSON
func GetJSON() []byte {
	nodes := read()
	JSON := nodes.ToJSON()
	return JSON
}

// errHandler : 异常处理函数
func errHandler(err error) {
	if err != nil {
		panic(err)
	}
}

// read : 读取 json 文件中的数据
func read() Nodes {
	file, err := os.OpenFile("sites.json", os.O_RDWR|os.O_CREATE, 0644)
	defer file.Close()
	errHandler(err)
	fileInfo, _ := file.Stat()
	if fileInfo.Size() == 0 {
		return nil
	}
	data := make([]byte, fileInfo.Size())
	num, err := file.Read(data)
	errHandler(err)
	fmt.Printf("%-8s: 读取数据: %d\n", "READ", num)
	var nodes Nodes
	err = json.Unmarshal(data, &nodes)
	errHandler(err)
	return nodes
}

// GetNode : 获取单个节点并写入文件
func GetNode() bool {
	var node Node
	nodes := read()
	node.ID = len(nodes) + 1
	fmt.Print("站点名:")
	fmt.Scan(&node.Data.Name)
	if nodes.Contain(node.Data.Name) {
		fmt.Printf("%-8s: 节点已存在\n", "GETNODE")
		return false
	}
	fmt.Print("英文名:")
	ScanStr(&node.Data.EnName)
	var num int
	fmt.Print("所属线路数量:")
	fmt.Scan(&num)
	for i, tmpStr := 0, ""; i < num; i++ {
		fmt.Printf("第 %d 个线路名:", i)
		fmt.Scan(&tmpStr)
		node.Data.Line = append(node.Data.Line, tmpStr)
	}
	fmt.Print("邻接站点数量:")
	fmt.Scan(&num)
	for i, tmpStr := 0, ""; i < num; i++ {
		fmt.Printf("第 %d 个邻接站点名:", i)
		fmt.Scan(&tmpStr)
		for i := 0; i < len(nodes); i++ { // 连接新旧节点
			if nodes[i].Data.Name == tmpStr {
				fmt.Printf("%-8s: 找到匹配节点, 编号 %d\n", "GETNODE", nodes[i].ID)
				node.Sides = append(node.Sides, nodes[i].ID)
				nodes[i].Sides = append(nodes[i].Sides, node.ID)
				break
			}
		}
	}
	fmt.Printf("%-8s: %-4d: %s\n\t\t%s\n\t\tLine: %v\n\t\tSide: %v\n", "GETNODE", node.ID, node.Data.Name, node.Data.EnName, node.Data.Line, node.Sides)
	nodes = append(nodes, node)
	res := writeNodes(nodes)
	return res
}

// writeNodes : 向 json 文件写入邻接表信息; 参数, 邻接表数组
func writeNodes(nodes Nodes) bool {
	if nodes == nil {
		fmt.Printf("%-8s: 邻接表为空, 写入失败\n", "WRITE")
		return false
	}
	file, err := os.OpenFile("sites.json", os.O_RDWR|os.O_CREATE, 0644)
	defer file.Close()
	errHandler(err)
	fileInfo, _ := file.Stat()
	if fileInfo.Size() != 0 {
		oriNodes := read()
		for _, node := range oriNodes {
			if !nodes.Contain(node.Data.Name) {
				nodes = append(nodes, node)
			}
		}
	}
	os.Truncate(file.Name(), 0) // 清空文件数据
	num, err := file.Write(nodes.ToJSON())
	errHandler(err)
	fmt.Printf("%-8s: 写入数据: %d\n", "WRITE", num)
	return true
}

// ScanStr : 获取空格输入
func ScanStr(a *string) {
	reader := bufio.NewReader(os.Stdin)
	data, _, _ := reader.ReadLine()
	*a = string(data)
}
