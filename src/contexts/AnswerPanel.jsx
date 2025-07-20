
const styles = {
    box: {
        width: '100%',
        backgroundColor: 'rgb(169, 170, 160)',
        margin: '35px',
        marginLeft: '5px',
        border: '2px solid white',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 0 20px rgba(0,0,0,0.3)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        
        //fontFamily: "'Ruslan Display', cursive",
        //fontFamily: "'Bahiana', cursive",
        //fontFamily: "'Bungee', sans-serif",
        fontFamily: "'Croissant One', cursive",
    },
};

function AnswerPanel() {

    return (
        <div style={styles.box}>
            <span style={{color: 'white'}}>This is Answer panel.</span>
        </div>
    );
}

export default AnswerPanel;