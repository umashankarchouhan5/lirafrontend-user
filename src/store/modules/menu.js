export default {
    state: {
        menu: []
    },
    mutations: {
        setMenu(state, menu) {
            state.menu = menu.map(item => {
                item.isOpened = false;
                item.isActive = false;
                item.submenu = item.submenu.map(subItem => {
                    subItem.isActive = false;
                    return subItem;
                });
                return item;
            });
        },
        handleClick(state, id) {
            state.menu.forEach(item => {
                if (item.id === id) {
                    item.isOpened = !item.isOpened
                } else {
                    item.isOpened = false
                }
            })
        },
    }
}