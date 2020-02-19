
export const sidebarActions = {

    showTab 
}

function showTab(name)
{
  return dispatch => {
     dispatch(update(name));
     localStorage.setItem('activeTab',name);

  };
  
  function update(name) { return {type : name}};
}