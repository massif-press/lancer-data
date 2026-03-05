# LANCER Data TODO

### Action System Improvements

- [ ] **Standardize action field schemas**: Create consistent field patterns across action objects in different files:
  - Core actions (actions.json) vs embedded actions (systems, weapons, talents)
  - Downtime actions use different table-based structure than combat actions
  - Some actions have `pilot`/`mech` flags, others don't specify context

- [ ] **Enhance action metadata**:
  - Add `category` field to group related actions (Combat, Tech, Movement, etc.)
  - Add `prerequisites` field for actions requiring specific equipment/conditions
  - Add `range` and `target` specifications for consistency with weapon patterns
  - Add `tags` support for actions to enable filtering and special interactions

- [ ] **Improve activation type consistency**:
  - Standardize "Free Action" vs "Free" vs "Protocol" terminology
  - Some embedded actions use non-standard activation types
  - Consider adding sub-types (e.g., "Quick Tech" could be "Quick" with tech category)

- [ ] **Extend damage/effect modeling**:
  - Unify `add_status`, `add_special`, `damage` patterns across all action types
  - Add support for conditional effects (e.g., "on critical hit", "if target is flying")
  - Add duration specifiers for ongoing effects
  - Support for scaling effects based on pilot level/grit

- [ ] **Add action relationship mapping**:
  - Link related actions (e.g., Mount/Dismount, Engage/Disengage COMP/CON)
  - Support for action chains or combo actions
  - Track mutually exclusive actions

- [ ] **Enhance validation for action objects**:
  - Validate activation types against standard list
  - Check that status references in `add_status` exist in statuses.json
  - Ensure `damage` objects have valid damage types
  - Validate `target` specifications and ranges

- [ ] **Improve downtime action structure**:
  - Consider unifying downtime and combat action schemas where possible
  - Add support for custom dice (beyond d20) in table results
  - Enable conditional result tables based on pilot stats/equipment

- [ ] **Add action cost modeling**:
  - Support for heat costs, SP costs, or other resource expenditure
  - Limited use tracking (beyond simple frequency strings)
  - Cooldown mechanics for powerful actions

### Data Validation & Quality

- [ ] **Add schema validation**: Currently only basic JSON syntax checking in test.js
- [ ] **Implement cross-reference validation**: Check that:
  - `license_id` fields reference valid frames
  - `source` fields reference valid manufacturers
  - Tag IDs referenced in items exist in tags.json
  - Action IDs referenced exist in actions.json

- [ ] **Create data consistency audit script**: Check for:
  - Orphaned references
  - Missing required fields
  - Invalid enum values
  - Duplicate IDs across files

### Build & Development Process

- [ ] **Enhance build script**: Currently just creates zip archive
  - Add validation step before building
  - Generate manifest checksums
  - Create different build targets (dev/production)

- [ ] **Improve testing framework**:
  - Add more comprehensive JSON validation
  - Test data relationships and references
  - Performance testing for large data sets

### Documentation

- [ ] **Generate API documentation**: Auto-generate from schemas
- [ ] **Create data migration guide**: For version updates
- [ ] **Document ID naming conventions**: Establish and document standards

### Package Management

- [ ] **Complete migration to scoped package**: Finish transition from `lancer-data` to `@massif/lancer-data`
- [ ] **Version management**: Implement semantic versioning strategy for data updates

### Code Organization

- [ ] **Split large JSON files**: Consider breaking up very large files (weapons.json is 3043 lines)
- [ ] **Implement data categorization**: Group related items within files
- [ ] **Create utility scripts**:
  - Data migration tools
  - Bulk editing utilities
  - Validation helpers

### Performance & Optimization

- [ ] **Optimize data structure**: Review for load performance in COMP/CON
- [ ] **Minimize redundant data**: Look for opportunities to normalize repeated information
- [ ] **Create indexed views**: For common query patterns

### Accessibility & Usability

- [ ] **Review description formatting**: Ensure consistent HTML usage in description fields
- [ ] **Standardize terse text**: Consistent formatting for UI condensed views
- [ ] **Image accessibility**: Alt text and consistent sizing

---

_This analysis was generated on 2026-02-18 based on examination of the codebase structure and data files._
