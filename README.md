# GitProxy v1.1.0

Testing GitLabFlow branching strategy. This should automatically create a draft setting the project to `v1.1.0`.

Simulating bugfix in v1.1.0. This should trigger a v1.1.1 publish from the `release-drafter.yml`. Making a new PR. Making a second PR.

Testing new feature on `v1.1.0`, from `main`. This should automatically create a draft setting the project to `v1.2.0`. Note that `v1.1.0` release has already been made, and a `v1.1.1` bugfix draft is present.
