ALTER TABLE `favorites` RENAME COLUMN `object_id` TO `body`;--> statement-breakpoint
DROP INDEX IF EXISTS `favorites_object_id_unique`;--> statement-breakpoint
CREATE UNIQUE INDEX `favorites_body_unique` ON `favorites` (`body`);