export const dashboardStyles = `
.container {
    display: flex;
}

[class*='layers']
{
    display: flex;
    flex-direction: row;
}

.sidebar {
    width: 13.33%; /* 1/3 of the screen */
    background-color: #27272a; /* Optional: add a background color for visibility */
    height: 100%; /* Optional: add a background color for visibility */
    z-index: 3001; /* Discord is for some reason 3000 exactly for loading screen. */
    display: inline;
}

.main-content {
    width: 26.67%; /* 2/3 of the screen */
    background-color: #3f3f46; /* Optional: add a background color for visibility */
    z-index: 3001; /* Discord is for some reason 3000 exactly for loading screen. */
    display: inline;
}
`

export const Sidebar = () => {
    return (<>
        <div className="sidebar">
        </div>
        <div className="main-content">

        </div>
    </>)
};

const MainContent = () => {
    return <div className="main-content">Main Content</div>;
};

const App = () => {
    return (
        <div className="container">
            <Sidebar/>
            <MainContent/>
        </div>
    );
};
