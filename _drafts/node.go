package metro

import (
	"encoding/json"
	"fmt"
)

type nodeData struct {
	Name   string `json:"name"`
	EnName string `json:"name_en"`
	// IsTerminal bool `json:"is_terminal"`
	Line []string `json:"line"`
}

// Node : 地铁站节点
type Node struct {
	ID    int      `json:"id"`
	Data  nodeData `json:"data"`
	Sides []int    `json:"sides"`
}

// Nodes : 地铁站节点图
type Nodes []Node

// Show : 打印表
func (nodes Nodes) Show() {
	for _, node := range nodes {
		fmt.Printf("%-4d: %s\n\t%s\n\tLine: %v\n\tSide: %v\n", node.ID, node.Data.Name, node.Data.EnName, node.Data.Line, node.Sides)
	}
}

// ToJSON : 将表输出为 JSON 数据
func (nodes Nodes) ToJSON() []byte {
	JSON, err := json.MarshalIndent(nodes, "", "\t")
	errHandler(err)
	return JSON
}

// Contain : 判断表中是否包含某一节点; 参数: 站点名 string
func (nodes Nodes) Contain(siteName string) bool {
	for _, node := range nodes {
		if node.Data.Name == siteName {
			return true
		}
	}
	return false
}
