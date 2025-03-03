const { Component, mount, useState, xml } = owl;


class Task extends Component {
    static template = xml` 
                        <li t-attf-style="background-color: #{state.color}" class=" d-flex justify-content-between align-items-center border rounded p-3 mb-3">

                            <div t-if="state.isEditing" class="d-flex align-items-center flex-grow-1 me-3">
                                <input type="text" class="form-control me-2" t-model="state.name"/>
                                <input type="color" style="width: 60px;" class="form-control-color form-control-color-sm" id="color"
                                    title="Choose your color" t-model="state.color"/>
                            </div>

                            <div t-if="!state.isEditing" class="form-check form-switch fs-5">
                                <input class="form-check-input" type="checkbox" value="" id="flexCheckDefault" t-att-checked="state.isCompleted" t-att-id="state.id" t-on-click="toggleTask"/>
                                <label class="form-check-label" t-att-for="state.id" t-attf-class="#{state.isCompleted ? 'text-decoration-line-through' : ''}">
                                    <t t-esc="state.name"/>
                                </label>
                            </div>

                            <div>
                                <button t-if="!state.isEditing" class="btn btn-secondary" t-on-click="editTask"><i class="bi bi-pencil"></i></button>
                                <button t-if="state.isEditing" class="btn btn-success" t-on-click="saveTask"><i class="bi bi-check-lg"></i></button>
                                <button class="btn btn-danger" t-on-click="deleteTask"><i class="bi bi-trash"></i></button>
                            </div>
                        </li>
`;
    static props = ['task', 'onDelete', 'onEdit'];

    setup() {
        this.state = useState({
            isEditing: false,
            name: this.props.task.name,
            color: this.props.task.color,
            id: this.props.task.id,
            isCompleted: this.props.task.isCompleted,
        });
    }


    toggleTask() {
        this.state.isCompleted = !this.state.isCompleted;
    }

    deleteTask() {
        this.props.onDelete(this.id);
    }

    editTask() {
        this.state.isEditing = true;
    }

    saveTask() {
        this.state.isEditing = false;
        this.props.onEdit(this.state.name);
    }
}

class Root extends Component {
    static template = xml`  
            <div>
                <div class="input-group-lg w-100 d-flex border rounded align-items-center">
                    <input type="text" class="form-control-lg flex-fill border-0 me-1" placeholder="Add a task" aria-label="Recipient's username"
                        aria-describedby="basic-addon2" t-att-value="state.name" t-model="state.name"/>
                    <input type="color" class="form-control-lg form-control-color border-0 bg-white m-0" id="color" t-att-value="state.color"
                        title="Choose your color" t-model="state.color"/>
                    <div class="input-group-append">
                        <button class="btn btn-primary" type="button" t-on-click="addTask"><i class="bi bi-plus-lg fs-6"></i>
</button>
                    </div>
                </div>

                <ul class="d-flex flex-column mt-5">
                    <t t-foreach="tasks" t-as="task" t-key="task.id">
                        <Task task="task" onDelete.bind="deleteTask" onEdit.bind="editTask"/>
                    </t>
                </ul>
            </div>
`;


    static components = { Task };

    setup() {

        this.state = useState({
            name: '',
            color: '#563d7c',
            isCompleted: false,
        });

        this.tasks = useState([]);

    }

    addTask() {
        if (!this.state.name) {
            alert('Please enter a task name');
            return
        };
        this.tasks.push({
            id: _.uniqueId(),
            name: this.state.name,
            color: this.state.color,
            isCompleted: false,
        });

        let state = this.state;
        this.state = {
            name: '',
            color: '#563d7c',
            isCompleted: false,
        };
    }

    deleteTask(task) {
        const index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1);
    }

    editTask(task) {
        const index = this.tasks.indexOf(task);
        this.tasks.splice(index, 1, task);
    }
}



mount(Root,document.getElementById('app'));