export default {
  props: {
    data: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  render(h) {
    const data = this.data
    return (
      <el-table height='100%' data={data.rows} props={this.$attrs} on={this.$listeners}>
        {this.colums(data.head)}
        {this.$slots.default}
      </el-table>

    )
  },
  methods: {
    colums(data) {
      const colums = data.map(head =>
        <el-table-column
          key={head.key}
          prop={head.key ? head.key : ''}
          label={head.name}
          width={head.width ? head.width : ''}
          props={head.attrs}
          on={head.listeners}
          scopedSlots={ head.slot ? {
            default: scope => {
              return (
                head.slot ? head.slot(scope) : ''
              )
            }
          } : ''}>
          {
            head.sub ? this.colums(head.sub) : head.slot
          }
        </el-table-column>
      )
      return colums
    }
  }
}
