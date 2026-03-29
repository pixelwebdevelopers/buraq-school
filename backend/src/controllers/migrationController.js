const { exec } = require('child_process');
const path = require('path');

/**
 * Controller for handling database migrations and seeders via API.
 */
const migrationController = {
    /**
     * Trigger database migrations.
     */
    migrate: (req, res) => {
        const command = 'npx sequelize-cli db:migrate';
        
        exec(command, { cwd: path.join(__dirname, '../../') }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Migration error: ${error.message}`);
                return res.status(500).json({
                    success: false,
                    message: 'Migration failed',
                    error: error.message,
                    stderr: stderr
                });
            }
            
            console.log(`Migration stdout: ${stdout}`);
            return res.status(200).json({
                success: true,
                message: 'Migration completed successfully',
                output: stdout
            });
        });
    },

    /**
     * Trigger database seeders.
     */
    seed: (req, res) => {
        const command = 'npx sequelize-cli db:seed:all';
        
        exec(command, { cwd: path.join(__dirname, '../../') }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Seeding error: ${error.message}`);
                return res.status(500).json({
                    success: false,
                    message: 'Seeding failed',
                    error: error.message,
                    stderr: stderr
                });
            }
            
            console.log(`Seeding stdout: ${stdout}`);
            return res.status(200).json({
                success: true,
                message: 'Seeding completed successfully',
                output: stdout
            });
        });
    },

    /**
     * Trigger database synchronization (sync with alter: true).
     */
    sync: (req, res) => {
        const command = 'node src/sync.js';
        
        exec(command, { cwd: path.join(__dirname, '../../') }, (error, stdout, stderr) => {
            if (error) {
                console.error(`Sync error: ${error.message}`);
                return res.status(500).json({
                    success: false,
                    message: 'Database sync failed',
                    error: error.message,
                    stderr: stderr
                });
            }
            
            console.log(`Sync stdout: ${stdout}`);
            return res.status(200).json({
                success: true,
                message: 'Database sync completed successfully',
                output: stdout
            });
        });
    }
};

module.exports = migrationController;
